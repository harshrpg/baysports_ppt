import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baysports Payments & Invoice Management | Fracto",
  description: "Interactive customer presentation for the Baysports payments and invoice management programme.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
