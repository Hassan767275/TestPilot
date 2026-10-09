export async function createUrl(url: string) {
  const response = await fetch("http://localhost:8000/api/tests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url
    }),
  });
  return response
}
