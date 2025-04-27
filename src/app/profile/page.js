"use client";

import React from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import {
  AiFillCaretLeft,
  AiFillClockCircle,
  AiFillEdit,
  AiFillFileWord,
} from "react-icons/ai";
import StickyNote from "@/components/stickyNote";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { IoBookmark } from "react-icons/io5";

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
  const [username, setUsername] = useState("loading...");
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
      <div className="flex flex-row justify-around items-center bg-cream min-h-screen">
        <div
          className={`flex-1 max-w-xl p-8 pt-10 ${ibmPlexMono.className} bg-cream flex flex-col justify-center mx-8`}
        >
          <Link href="/">
            <div className="flex flex-row justify-between mb-1">
              <h1 className="text-lg font-light mb-1">
                <AiFillCaretLeft className="inline-block mr-2 text-xl" />
                &nbsp;
                <p className="inline-block hover:underline">write on!</p>
              </h1>
            </div>
          </Link>
          <div className="flex flex-row justify-between mb-1">
            <h1 className="text-lg font-light mb-1">
              <AiFillEdit className="inline-block mr-2 text-xl" />
              &nbsp;pen name
            </h1>
            <h1 className="text-lg font-light mb-1">{`${username}`}</h1>
          </div>
          <div className="flex flex-row justify-between mb-1">
            <h2 className="text-lg font-light mb-1">
              <AiFillClockCircle className="inline-block mr-2 text-xl" />
              &nbsp;user since
            </h2>
            <h2 className="text-lg font-light mb-1">{date}</h2>
          </div>
          <div className="flex flex-row justify-between mb-1">
            <h2 className="text-lg font-light mb-1">
              <FaBookOpen className="inline-block mr-2 text-xl" />
              &nbsp;stories written
            </h2>
            <h2 className="text-lg font-light mb-1">{storiesWritten}</h2>
          </div>
          <div className="flex flex-row justify-between mb-1">
            <h2 className="text-lg font-light mb-1">
              <AiFillFileWord className="inline-block mr-2 text-xl" />
              &nbsp;words written
            </h2>
            <h2 className="text-lg font-light mb-1">{wordsWritten}</h2>
          </div>
          <div className="flex flex-row justify-between mb-1">
            <h2 className="text-lg font-light mb-1">
              <IoBookmark className="inline-block mr-2 text-xl" />
              &nbsp;bookmarks
            </h2>
            <h2 className="text-lg font-light mb-1">{bookmarks}</h2>
          </div>
        </div>
        <div className="flex flex-col max-w-5xl pt-4 px-6">
          {/* dropdown fixed inside the right column */}
          <div className="sticky top-0 z-10 bg-cream pb-4">
            <div className="flex justify-start">
              <select className={`${ibmPlexMono.className} pr-4`}>
                <option className={ibmPlexMono.className} value="newest">stories</option>
                <option className={ibmPlexMono.className} value="saved">bookmarks</option>
              </select>
            </div>
          </div>

          {/* scrollable sticky notes below */}
          <div className="flex flex-wrap justify-start gap-6 overflow-y-auto max-h-[80vh]">
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
        </div>
      </div>
    </>
  );
}
