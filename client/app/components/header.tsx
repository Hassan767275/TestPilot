import Image from "next/image";

export default function Header() {
  return (
    <header className="h-16 py-2 flex items-center border-b-1 border-neutral-200">
      <Image
        src="/logo.png"
        width={50}
        height={50}
        className="rounded-lg ml-30"
        alt="Website Logo"
      />
      <h1 className="font-bold text-2xl ml-4">TestPilot</h1>
    </header>
  );
}
