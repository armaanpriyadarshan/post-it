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

export default function Prompt({ prompt, stickyNotes, numWords }) {
  return (
    <div className="flex flex-col items-center justify-center mx-12 mt-12 max-w-4xl mx-auto text-center">
      <p className={`text-brown ${ibmPlexMono.className} text-xl underline`}>
        today&apos;s prompt is...
      </p>
      <p className={`text-green ${robotoCondensed.className} text-4xl uppercase mt-4`}>
        {prompt}
      </p>
    </div>
  );
}