import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-center mt-24 gap-3">
      <h2 className="text-2xl font-bold">Report not found</h2>
      <p className="text-[#525252]">
        This test doesn't exist or doesn't have a report yet.
      </p>
      <Link href="/" className="bg-black text-white px-4 py-2 rounded-lg">
        Back to tests
      </Link>
    </div>
  );
}