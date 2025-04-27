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
import Logout from "@/components/logout";

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
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("loading...");
  const [storiesWritten, setStoriesWritten] = useState(0);
  const [wordsWritten, setWordsWritten] = useState(0);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [bookmarks, setBookmarks] = useState(0);
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [showYours, setShowYours] = useState(true);

  useEffect(() => {
    const { data, error } = supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
    }
    if (data) {
      setUser(data.user);
    }
  }, []);

  useEffect(() => {
    setUsername(user?.user_metadata?.full_name || "loading...");
  }, [user]);

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      if (!user) {
        setUser(session.user);
      }
    } else {
      if (user) {
        setUser(null);
      }
    }
  })

  useEffect(() => {
    const fetchDate = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("created_at")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching date:", error);
      } else {
        const createdAt = new Date(data.created_at).toISOString().split("T")[0];
        setDate(createdAt);
      }
    }

    if (user) {
      fetchDate();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setStickyNotes([]);
      return;
    }
  
    (async () => {
      try {
        // 1. grab the array of note-IDs
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("notes")
          .eq("id", user.id)
          .single();
        if (userError) throw userError;
  
        const noteIds = Array.isArray(userData.notes)
          ? userData.notes.map((n) => parseInt(n, 10))
          : [];
  
        // if user has no notes, clear state and bail
        if (noteIds.length === 0) {
          setStickyNotes([]);
          return;
        }
  
        // 2. fetch only those notes, newest first
        const { data: notes, error: notesError } = await supabase
          .from("notes")
          .select("*")
          .in("id", noteIds)
          .order("created_at", { ascending: false });
        if (notesError) throw notesError;
  
        setStickyNotes(notes);
      } catch (err) {
        console.error("Error fetching sticky notes:", err);
        setStickyNotes([]);
      }
    })();
  }, [user]);  

  useEffect(() => {
    if (!user) {
      setBookmarkedNotes([]);
      return;
    }
  
    (async () => {
      try {
        // 1. grab the array of note-IDs
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("bookmarked")
          .eq("id", user.id)
          .single();
        if (userError) throw userError;
  
        const noteIds = Array.isArray(userData.bookmarked)
          ? userData.bookmarked.map((n) => parseInt(n, 10))
          : [];
  
        // if user has no notes, clear state and bail
        if (noteIds.length === 0) {
          setBookmarkedNotes([]);
          return;
        }
  
        // 2. fetch only those notes, newest first
        const { data: notes, error: notesError } = await supabase
          .from("notes")
          .select("*")
          .in("id", noteIds)
          .order("created_at", { ascending: false });
        if (notesError) throw notesError;
  
        setBookmarkedNotes(notes);
      } catch (err) {
        console.error("Error fetching sticky notes:", err);
        setBookmarkedNotes([]);
      }
    })();
  }, [user]);  

  useEffect(() => {
    const totalWords = stickyNotes.reduce(
      (acc, note) => acc + (note.story ? note.story.split(" ").length : 0),
      0
    );
    setWordsWritten(totalWords);

    setStoriesWritten(stickyNotes.length);
  }, [stickyNotes]);

  useEffect(() => {
    const totalBookmarks = stickyNotes.reduce(
      (acc, note) => acc + (note.bookmarks || 0),
      0
    );
    setBookmarks(totalBookmarks);
  }, [stickyNotes]);

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
            <h1 className="text-lg font-light mb-1">{`${username.toLowerCase()}`}</h1>
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
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-light mb-1">
              <IoBookmark className="inline-block mr-2 text-xl" />
              &nbsp;bookmarks received
            </h2>
            <h2 className="text-lg font-light mb-1">{bookmarks}</h2>
          </div>

        <div className="ml-auto">

          <Link 
            onClick={() => {
              supabase.auth.signOut();
              setUser(null);
            }}
            href="/"
          >
            <Logout />
          </Link>
        </div>
        </div>
        <div className="flex flex-col max-w-5xl pt-4 px-6">
          <>
            {/* dropdown fixed inside the right column */}
            <div className="sticky top-0 z-10 bg-cream pb-4">
              <div className="flex justify-start">
                <select 
                  onChange={(val) => {
                    if (val.target.value === "newest") {
                      setShowYours(true);
                    } else {
                      setShowYours(false);
                    }
                  }}
                  className={`${ibmPlexMono.className} pr-4`}
                >
                  <option className={ibmPlexMono.className} value="newest">stories</option>
                  <option className={ibmPlexMono.className} value="saved">bookmarks</option>
                </select>
              </div>
            </div>

            {/* scrollable sticky notes below */}
            <div className="flex flex-wrap justify-start gap-6 overflow-y-auto max-h-[80vh]">
              {(showYours ? stickyNotes : bookmarkedNotes).length > 0 ? (
                (showYours ? stickyNotes : bookmarkedNotes).map((note) => (
                  <StickyNote
                    key={note.id}
                    text={note.story}
                    author={note.author}
                    timestamp={note.created_at}
                    upvotes={note.upvotes}
                    title={note.title}
                    id={note.id}
                    color={green()}
                    width={250}
                    height={250}
                    user={user}
                  />
                ))
              ) : (
                /* if no sticky notes, show this centered text */
                <div className="flex flex-1 text-center">
                  <p className={`${ibmPlexMono.className} text-lg text-brown`}>
                    {showYours
                      ? "you must get cold surrounded by all these drafts!"
                      : "if stories built character, you'd still be under construction"}
                  </p>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
}
