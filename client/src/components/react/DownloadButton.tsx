export default function DownloadButton({
  fileName,
  handleUrl,
  handleDone,
}: {
  fileName: string;
  handleUrl: Function;
  handleDone: Function;
}) {
  const handleClick = async () => {
    handleUrl();
    handleDone(false);
    const response = await fetch(`/yt/song/${fileName}`, {
      method: "GET",
    });

    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(await response.blob());
    link.download = fileName.split("_").join(" ");
    link.click();

    window.URL.revokeObjectURL(link.href);
  };

  return (
    <button
      className="bg-transparent text-center dark:text-white rounded-lg border border-red-300 hover:border-red-500 px-3 py-2 outline-none transition-colors"
      onClick={handleClick}
    >
      Descargar
    </button>
  );
}
