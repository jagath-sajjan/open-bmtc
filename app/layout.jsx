import "./globals.css";
import Link from "next/link";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";

export const metadata = {
  title: "OPEN-BMTC",
  description: "A Open Source BMTC transit app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black">
        <div className="min-h-screen grid grid-rows-[auto,1fr]">
          <header className="border-b-2 border-white px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">OPEN-BMTC</Link>
              <div className="text-sm md:text-base font-mono">For The People By The People</div>
            </div>
          </header>
          <main className="px-6 py-6">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
          <footer className="border-t-2 border-white px-6 py-4">
            <div className="max-w-6xl mx-auto text-xs md:text-sm font-mono">Open Source Site ~ Jagath Sajjan</div>
          </footer>
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
