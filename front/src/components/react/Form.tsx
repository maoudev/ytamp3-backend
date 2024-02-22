import { useState } from "react";

import { getSong } from "../../services/getSong";
import DownloadButton from "./DownloadButton";
import "./Form.css";

export default function Form() {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const removeUrl = () => {
    setUrl("");
  };

  const toggleDone = (value: boolean) => {
    setDone(value);
  };

  const toggleLoading = (value: boolean) => {
    setDone(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const response = await getSong(url).then();
    if (response.status != 200) {
      setError(true);
    } else {
      setError(false);
    }

    const { file } = await response.json();
    setFileName(file);

    setLoading(false);
    setDone(true);
  };

  return (
    <div className="">
      <form
        className="flex flex-col items-center mt-4 
         space-y-5"
        onSubmit={handleSubmit}
      >
        <label className="dark:text-white text-lg lg:text-md" htmlFor="url">
          Inserta la url del video de youtube
        </label>
        <input
          id="url"
          className="bg-transparent text-black dark:text-white rounded-lg border border-red-300 focus:border-blue-500 hover:border-red-500 px-3 py-2 outline-none transition-colors"
          type="text"
          name="url"
          value={url}
          placeholder="www.youtube.com/watch?v=..."
          required
          onChange={(e) => setUrl(e.target.value)}
        />

        {!done && !loading ? (
          <button
            type="submit"
            className="bg-transparent dark:text-white rounded-lg border border-red-300 hover:border-red-500 px-3 py-2 outline-none transition-colors"
          >
            Convertir
          </button>
        ) : null}

        {done && !loading ? (
          <DownloadButton
            fileName={fileName}
            handleUrl={removeUrl}
            handleDone={toggleDone}
          />
        ) : null}

        {loading ? (
          <button className="bg-transparent border border-red-500 text-black dark:text-white rounded-lg px-3 py-2 outline-red-600 transition-colors">
            Cargando...
            <span className="animate-spin inline-block h-4 w-4 border-t-2 border-b-2 border-black dark:border-white rounded-full" />
          </button>
        ) : null}
      </form>

      {error && <p className="text-red-500">Error</p>}
    </div>
  );
}
