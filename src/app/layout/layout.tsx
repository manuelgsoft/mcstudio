import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Lora,
  Montserrat,
  Oswald,
  Poppins,
  Roboto,
} from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "MC Studio",
  description: "Diseñamos tu viaje ideal",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${montserrat.variable} ${poppins.variable} ${lora.variable} ${oswald.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
