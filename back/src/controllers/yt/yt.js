import ytdl from "ytdl-core";
import fs from "fs";
import ffmpeg from "ffmpeg";
import NodeID3 from "node-id3";
import path from "path";

export const downloadHandler = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "url required" });

  if (!validateYouTubeUrl(url)) {
    return res.status(400).json({ error: "invalid url" });
  }

  let title = "";
  try {
    const info = await ytdl.getInfo(url);
    title = info.videoDetails.title.split(" ").join("_");
    const author = info.videoDetails.author.name;
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

    const video = ytdl(url, { format: format }).pipe(
      fs.createWriteStream(`./src/videos/${title}.mp4`)
    );

    await new Promise((resolve, reject) => {
      video.on("finish", () => {
        console.log("downloaded");
        resolve();
      });
      video.on("error", (error) => {
        reject(error);
      });
    }).catch((error) => {
      return res.status(500).json({ error: error.message });
    });

    const process = new ffmpeg(`./src/videos/${title}.mp4`, {});

    await new Promise((resolve, reject) => {
      process.then((audio) => {
        audio.fnExtractSoundToMP3(`./src/songs/${title}.mp3`, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });

    await setInfoToMp3(title, author);
    return res
      .status(200)
      .json({ url: `http://localhost:3000/yt/song/${title}.mp3` });
  } catch (error) {
    return res.status(500);
  }
};

export const getSong = async (req, res) => {
  const { fileName } = req.params;
  if (!fileName) return res.status(400).json({ error: "file name required" });
  try {
    const path_file = path.resolve(`./src/songs/${fileName}`);
    if (fs.existsSync(path_file)) {
      return res.sendFile(path_file);
    } else {
      return res.status(404).json({ error: "file not found" });
    }
  } finally {
    let file = fileName.split("/").pop().split(".")[0];
    await deleteFiles(file);
  }
};

const setInfoToMp3 = async (title, author) => {
  let originalTitle = title.split("_").join(" ");

  const tags = {
    title: originalTitle,
    artist: author,
  };
  NodeID3.write(tags, `./src/songs/${title}.mp3`, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("tags added");
    }
  });
};

const deleteFiles = async (fileName) => {
  setTimeout(async () => {
    try {
      await fs.promises.rm(`./src/videos/${fileName}.mp4`);
      await fs.promises.rm(`./src/songs/${fileName}.mp3`);
    } catch (error) {
      console.log(error);
    }
  }, 60000);
};

const validateYouTubeUrl = (url) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
  return pattern.test(url);
};
