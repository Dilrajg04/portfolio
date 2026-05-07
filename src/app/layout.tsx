import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dm = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Dilraj Grewal",
  description:
    "Data science student, builder, and storyteller. Working at the seams of numbers, code, and narrative.",
  openGraph: {
    title: "Dilraj Grewal",
    description:
      "Data science student, builder, and storyteller. Working at the seams of numbers, code, and narrative.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${dm.variable}`}>
      <body className="bg-white text-[#0a0a0a] min-h-screen">
        {children}
      </body>
    </html>
  );
}
