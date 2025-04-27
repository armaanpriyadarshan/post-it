"use client";

import { IBM_Plex_Mono, Roboto_Condensed } from "next/font/google";
import StickyNote from "@/components/stickyNote";
import Footer from "@/components/footer";
import Prompt from "@/components/prompt";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import Add from "@/components/add";

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

export default function Home() {
  const [prompt, setPrompt] = useState("Loading...");
  const [stickyNotes, setStickyNotes] = useState([]);
  const [numWords, setNumWords] = useState(0);
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
    <>
      <Link href="/profile">
        <div
          className={`flex justify-end pt-5 pr-7 bg-cream ${ibmPlexMono.className} hover:underline`}
        >
          <p>{username}</p>
        </div>
      </Link>
      <div className="min-h-screen flex flex-col items-center">
        <Prompt prompt={prompt} stickyNotes={stickyNotes} numWords={numWords} />
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
        <Footer />
      </div>
    </>
  );
}
