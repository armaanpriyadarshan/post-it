import { IBM_Plex_Mono, Roboto_Condensed } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["200"], // Thin weight
  display: "swap",
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center m-12">
        <p className={`text-brown ${ibmPlexMono.className} text-2xl underline`}>
          today&apos;s prompt is...
        </p>
        <p className={`text-green ${robotoCondensed.className} text-6xl uppercase mt-4`}>
          * prompt *
        </p>
      </div>
    </div>
  );
}