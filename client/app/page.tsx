import Image from "next/image";

export default function Home() {
  async function sendRequest() {
    "use server"
    const request = await fetch("http://localhost:8000")
  }
  return (
    <div>
      <h1>helloooo</h1>
      <button onClick={sendRequest}>click me</button>
    </div>
  );
}
