import { IBM_Plex_Mono, Roboto_Condensed } from "next/font/google";
import StickyNote from "@/components/stickyNote";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["200"],
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
        <div className="flex flex-wrap justify-center gap-4 p-4">
          <StickyNote
            text="This is a sticky note with some text."
            color="#FFEB3B"
            width={200}
            height={200}
          />
          <StickyNote
            text="Another sticky note with different text."
            color="#FF9800"
            width={250}
            height={250}
          />
          <StickyNote
            text="Yet another sticky note, this one is larger."
            color="#4CAF50"
            width={300}
            height={300}
          />
        </div>
      </div>
  );
}