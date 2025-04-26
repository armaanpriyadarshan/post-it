"use client";

import { IBM_Plex_Mono, Roboto_Condensed } from "next/font/google";
import StickyNote from "@/components/stickyNote";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
});

function green() {
  const hue = 120; // green hue
  const saturation = Math.floor(Math.random() * 20) + 30;
  const lightness = Math.floor(Math.random() * 20) + 75;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{time.toLocaleTimeString()}</span>;
};

export default function Home() {
  const [prompt, setPrompt] = useState("Loading...");
  const [stickyNotes, setStickyNotes] = useState([]);
  const [numWords, setNumWords] = useState(0);

  const getPrompt = async () => {
    const { data, error } = await supabase
      .from("prompts")
      .select("prompt")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching prompt:", error);
    }

    setPrompt(data[0]?.prompt || "No prompt available");
  };

  const getStickyNotes = async (order) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .gte(
        "created_at",
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      )
      .order(order === "newest" ? "created_at" : "upvotes", {
        ascending: order === "newest",
      });

    if (error) {
      console.error("Error fetching sticky notes:", error);
    }

    console.log("Sticky notes:", data);

    setStickyNotes(data || []);
  };

  useEffect(() => {
    getPrompt();
  }, []);

  useEffect(() => {
    getStickyNotes("newest");
  }, []);

  useEffect(() => {
    const totalWords = stickyNotes.reduce((acc, note) => {
      return acc + (note.story ? note.story.split(" ").length : 0);
    }, 0);
    setNumWords(totalWords);
  }, [stickyNotes]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center justify-center m-12 max-w-4xl mx-auto text-center">
        <p className={`text-brown ${ibmPlexMono.className} text-xl underline`}>
          today&apos;s prompt is...
        </p>
        <p
          className={`text-green ${robotoCondensed.className} text-4xl uppercase mt-4`}
        >
          {prompt}
        </p>
        <div
          className={`w-full px-10 pt-2 grid grid-cols-3 text-brown text-sm mt-2 ${ibmPlexMono.className}`}
        >
          <span>
            {new Date().toISOString().split("T")[0]} | <TimeDisplay />
          </span>
          <span>{stickyNotes.length} notes posted</span>
          <span>{numWords} words written</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-4 mx-auto">
        {stickyNotes.map((note) => (
          <StickyNote
            key={note.id}
            text={note.story}
            author={note.author}
            timestamp={note.created_at}
            upvotes={note.upvotes}
            title={note.title}
            color={green()}
            width={250}
            height={250}
          />
        ))}
      </div>
      <Link href="/writing-space">
        <Add />
      </Link>
      <Footer />
    </div>
  );
}
