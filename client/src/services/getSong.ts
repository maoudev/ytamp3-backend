export const getSong = async (url: string) => {
  const response = await fetch(`/yt/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  return response;
};
