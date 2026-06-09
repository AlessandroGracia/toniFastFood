import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ToniOS KDS",
  description: "Kitchen display shell for ToniOS."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
