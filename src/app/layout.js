import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "post.it",
  description: "share your stories!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className = "absolute top-0 left-0 z-10 m-4">
          <Image
            src = "/logo.png"
            alt = "postit logo"
            width = {50}
            height = {50}
          />
        </div>
        {children}
      </body>
    </html>
  );
}