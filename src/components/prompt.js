'use client';

import React from "react";
import { IBM_Plex_Mono, Roboto_Condensed } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300"], // match page.js where Roboto Condensed was weight 300
  display: "swap",
});

function TimeDisplay() {
  const [time, setTime] = React.useState(null);

  React.useEffect(() => {
    setTime(new Date());
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!time) return null; // avoid server-side hydration issues
  return <span>{time.toLocaleTimeString()}</span>;
}

export default function Prompt({ prompt, stickyNotes, numWords }) {
  return (
    <div className="flex flex-col items-center justify-center m-12 max-w-4xl mx-auto text-center">
      <p className={`text-brown ${ibmPlexMono.className} text-xl underline`}>
        today&apos;s prompt is...
      </p>
      <p className={`text-green ${robotoCondensed.className} text-4xl uppercase mt-4`}>
        {prompt}
      </p>
      <div className={`w-full px-10 pt-2 grid grid-cols-3 text-brown text-sm mt-2 ${ibmPlexMono.className}`}>
        <span>
          {new Date().toISOString().split("T")[0]} | <TimeDisplay />
        </span>
        <span>{stickyNotes.length} notes posted</span>
        <span>{numWords} words written</span>
      </div>
    </div>
  );
}