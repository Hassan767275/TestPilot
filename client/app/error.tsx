"use client";
import Header from "./components/header";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center text-center mt-24 gap-3">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-[#525252]">
          TestPilot ran into a problem on our end. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-neutral-700"
        >
          Try again
        </button>
      </div>
    </>
  );
}
