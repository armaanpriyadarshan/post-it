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

function TimeDisplay() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date());
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!time) return null; // avoid server-side hydration issues
  return <span>{time.toLocaleTimeString()}</span>;
}

export default function Home() {
  const [prompt, setPrompt] = useState("Loading...");
  const [stickyNotes, setStickyNotes] = useState([]);
  const [numWords, setNumWords] = useState(0);
  const [numUpvotes, setNumUpvotes] = useState(0);
  const [username, setUsername] = useState("Sign In");

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
      .order(order === "newest" ? "created_at" : "bookmarks", {
        ascending: order !== "newest",
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
    getStickyNotes("bookmarks");
  }, []);

  useEffect(() => {
    const totalWords = stickyNotes.reduce((acc, note) => {
      return acc + (note.story ? note.story.split(" ").length : 0);
    }, 0);
    setNumWords(totalWords);
  }, [stickyNotes]);

  useEffect(() => {
    const totalUpvotes = stickyNotes.reduce((acc, note) => {
      return acc + (note.upvotes || 0);
    }, 0);
    setNumUpvotes(totalUpvotes);
  }, [stickyNotes]);

  return (<>
    <Link href="/profile">
    <div
      className={`flex justify-end pt-5 pr-7 bg-cream ${ibmPlexMono.className} hover:underline`}
    >
      <p>{username}</p>
    </div>
    </Link>
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center justify-center mx-12 mt-12 mb-6 max-w-4xl mx-auto text-center">
        <p className={`text-brown ${ibmPlexMono.className} text-xl underline`}>
          today&apos;s prompt is...
        </p>
        <p className={`text-green ${robotoCondensed.className} text-4xl uppercase mt-4`}>
          {prompt}
        </p>

        <div
          className={`w-full px-10 pt-2 grid grid-cols-4 text-brown text-sm mt-2 ${ibmPlexMono.className}`}
        >
          <span>
            {new Date().toISOString().split("T")[0]} | <TimeDisplay />
          </span>
          <span>{stickyNotes.length} notes posted</span>
          <span>{numWords} words written</span>
          <span>{numUpvotes} bookmarks</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 px-4 mx-auto">
        {stickyNotes.map((note) => (
          <StickyNote
            key={note.id}
            text={note.story}
            author={note.author}
            timestamp={note.created_at}
            upvotes={note.upvotes}
            id={note.id}
            title={note.title}
            color={green()}
            width={250}
            height={250}
          />
        ))}
      </div>
      <div className="mb-7">
      </div>
      <Footer />
    </div>
  </>);
}
