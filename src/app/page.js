"use client";

import { IBM_Plex_Mono, Roboto_Condensed } from "next/font/google";
import StickyNote from "@/components/stickyNote";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Add from "@/components/add";
import Cookies from "js-cookie";


//fonts
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

function green() { //generate random green color
  const hue = 120; // green hue
  const saturation = Math.floor(Math.random() * 20) + 30;
  const lightness = Math.floor(Math.random() * 20) + 75;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const TimeDisplay = () => { //calculate and return time
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date());
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!time) return null; // avoid rendering on the server (which was causing hydration error)

  return <span>{time.toLocaleTimeString()}</span>;
};

const getMidnightExpiration = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // set to next midnight
  return Math.floor((midnight - now) / 1000); // return seconds until midnight
}

export default function Home() {
  const [prompt, setPrompt] = useState("Loading...");
  const [stickyNotes, setStickyNotes] = useState([]);
  const [numWords, setNumWords] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSecondText, setshowSecondText] = useState(false);
  const [showStickyNotes, setShowStickyNotes] = useState(false);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  useEffect(() => {
    // check if the user has already seen the welcome page today
    const hasSeenWelcome = Cookies.get("hasSeenWelcome");

    if (!hasSeenWelcome) {
      // show welcome page
      setShowWelcome(true);

      // set a cookie that expires at midnight
      Cookies.set("hasSeenWelcome", "true", { expires: getMidnightExpiration() / 86400 }); // Convert seconds to days
    } else {
      // skip the welcome page
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    const showSecond = async () => {
      await wait(2000); //wait 2s before showing 1st text
      setShowWelcome(true); //show welcome text
      await wait(200)
      setshowSecondText(true); //show 1s after 1st text
      await wait(500);
      setShowStickyNotes(true); //show 0.5s after 2nd text
    };
    showSecond();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Welcome Cover */}
      {showWelcome && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1500`}
          onClick={() => setShowWelcome(false)}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
            backdropFilter: showWelcome ? "blur(50px)" : "blur(0px)", // blur effect
            WebkitBackdropFilter: showWelcome ? "blur(50px)" : "blur(0px)", // for safari
            transition: "opacity 2s ease-in-out",
          }}
        >
          <div
            className="text-center p-100 rounded-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Welcome Text */}
            <h1
              className={`text-6xl font-bold mb-4 text-gray-900 ${ibmPlexMono.className} ${
                showWelcome ? "opacity-100" : "opacity-0"
              } transition-opacity duration-1000`}
            >
              welcome! today is {new Date().toISOString().split("T")[0]}.
            </h1>

            {/* Click Anywhere Text */}
            <p
              className={`text-xl mb-4 text-gray-900 ${ibmPlexMono.className} ${
                showSecondText ? "opacity-100" : "opacity-0"
              } transition-opacity duration-1000`}
            >
              click anywhere to continue.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
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

      {/* Sticky Notes */}
      {showStickyNotes && (
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
      )}

      <Link href="/writing-space">
        <Add />
      </Link>
      <Footer />
    </div>
  );
}
