import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Addis Eats | Order Analytics",
  description: "Accessible order and revenue analytics dashboard."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}