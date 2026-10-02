import "./globals.css";
import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin']})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
