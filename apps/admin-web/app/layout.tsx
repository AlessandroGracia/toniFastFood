import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ToniOS Admin",
  description: "SaaS command center for ToniOS restaurants."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
