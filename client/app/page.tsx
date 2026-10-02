import Image from "next/image";
import Header from "./components/header";

export default function Home() {
  async function sendRequest() {
    "use server"
    const request = await fetch("http://localhost:8000")
  }
  return (
    <div>
      <Header />
      <button onClick={sendRequest}>click me</button>
    </div>
  );
}
