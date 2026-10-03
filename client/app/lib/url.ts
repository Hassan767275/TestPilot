export async function createUrl(url: string) {
  const request = await fetch("http://localhost:8000/api/tests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url
    }),
  });
  return request
}
