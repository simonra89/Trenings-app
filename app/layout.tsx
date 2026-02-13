import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "Treningsapp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <Providers>
          <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col p-4">
            <nav className="mb-4 flex items-center justify-between rounded-xl border p-3 text-sm">
              <Link href="/dashboard" className="font-semibold">Treningsapp</Link>
              <div className="flex gap-3">
                <Link href="/workouts">Økter</Link>
                <Link href="/exercises">Øvelser</Link>
                <Link href="/programs">Programmer</Link>
              </div>
            </nav>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
