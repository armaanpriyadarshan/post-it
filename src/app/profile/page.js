"use client";

import React from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { FaBookOpen, FaPenFancy } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import StickyNote from "@/components/stickyNote";
import { supabase } from "@/lib/supabaseClient";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

function green() {
  const hue = 120; // green hue
  const saturation = Math.floor(Math.random() * 20) + 30;
  const lightness = Math.floor(Math.random() * 20) + 75;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function ProfilePage() {
  const [username, setUsername] = useState("muzu lasu");
  const [storiesWritten, setStoriesWritten] = useState(0);
  const [wordsWritten, setWordsWritten] = useState(0);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [bookmarks, setBookmarks] = useState(0);
  const [stickyNotes, setStickyNotes] = useState([]);

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
    getStickyNotes("newest");
  }, []);

  return (
    <>
      <div
        className={`max-w-4xl p-8 pt-10 ${ibmPlexMono.className} bg-cream flex flex-col justify-center items-left mx-auto`}
      >
        <h1 className="text-2xl font-light mb-4">
          <FaPenFancy className="inline-block mr-2 text-2xl" />
          {`${username}`}
        </h1>
        <h2 className="text-2xl font-light mb-4 flex items-center">
          <FiClock className="inline-block mr-2 text-xl" />
          {`\t\tuser since: ${date}`}
        </h2>
        <h2 className="text-2xl font-light mb-4 flex items-center">
          <FaBookOpen className="inline-block mr-2 text-xl" />
          {`\t\tstories written: ${storiesWritten}`}
        </h2>
        <h2 className="text-2xl font-light mb-4 flex items-center">
          <AiOutlineFileText className="inline-block mr-2 text-xl" />
          {`\t\twords written: ${wordsWritten}`}
        </h2>
        <h2 className="text-2xl font-light mb-4 flex items-center">
          <BsBookmark className="inline-block mr-2 text-xl" />
          {`\t\tbookmarks: ${bookmarks}`}
        </h2>
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
    </>
  );
}
