import Image from "next/image";
import Header from "./components/header";
import { createUrl } from "./lib/url";
import { create } from "domain";

export default function Home() {
  async function sendRequest(formData: FormData) {
    "use server";
    const url = formData.get("url") as string
    const request = await createUrl(url)
    const response = await request.json()
    console.log(response.message)
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center text-center mt-5 sm:mt-15">
        <h1 className="font-bold text-3xl sm:text-5xl mb-4 sm:mb-8">
          Test any web app by pasting its URL
        </h1>
        <h2 className="text-[#525252] text-base sm:mb-6 sm:text-lg">
          TestPilot sends an automated browser to your site and reports what it
          finds.
        </h2>
        <form className="px-1 w-full max-w-3xl" action={sendRequest}>
          <label htmlFor="url" className="text-left block px-2 text-[#525252] mb-2">Website URL</label>
          <div className="border border-neutral-200 rounded-xl flex items-center bg-white pr-2">
            <input
              className="pl-2 flex-1 min-w-0 h-16 outline-none"
              type="text"
              id="url"
              name="url"
              placeholder="https://your-app.com"
              required
            ></input>
            <button className="bg-black text-white px-4 py-2 rounded-lg">
              Run test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
