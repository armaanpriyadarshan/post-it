"use client";

import { IBM_Plex_Mono, Roboto_Condensed } from "next/font/google";
import StickyNote from "@/components/stickyNote";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

// Fonts
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

// Helper functions
function green() {
  const hue = 120;
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

  if (!time) return null;
  if (!time) return null;
  return <span>{time.toLocaleTimeString()}</span>;
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState("Loading...");
  const [stickyNotes, setStickyNotes] = useState([]);
  const [numWords, setNumWords] = useState(0);
  const [numUpvotes, setNumUpvotes] = useState(0);
  const [username, setUsername] = useState("sign in");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showStickyNotes, setShowStickyNotes] = useState(false);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to calculate time until midnight in days
  const getMidnightExpiration = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to midnight
    return (midnight - now) / (1000 * 60 * 60 * 24); // Return time in days
  };

  useEffect(() => {
    // Check if the user has already seen the welcome page today
    const hasSeenWelcome = Cookies.get("hasSeenWelcome");

    if (!hasSeenWelcome) {
      // Show the welcome page immediately
      setShowWelcome(true);

      // Set a cookie that expires at midnight
      Cookies.set("hasSeenWelcome", "true", {
        expires: getMidnightExpiration(),
      });
    }
  }, []);

  useEffect(() => {
    const showSequence = async () => {
      await wait(200); // Delay for the second text
      setShowSecondText(true); // Show the second text
      await wait(500); // Additional delay for sticky notes
      setShowStickyNotes(true); // Show sticky notes
    };

    showSequence(); // Run the sequence regardless of `showWelcome`
  }, []);

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

    setStickyNotes(data || []);
  };

  useEffect(() => {
    getPrompt();
    getStickyNotes("bookmarks");
  }, []);

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      if (!user) {
        setUser(session.user);
        setUsername(session.user.user_metadata.full_name || "Sign In");

      }
    } else {
      if (user) {
        setUser(null);
        setUsername("Sign In");  
      }
    }
  })

  useEffect(() => {
    const { data, error } = supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
    }
    if (data) {
      setUser(data.user);
      setUsername(data.user.user_metadata.full_name || "Sign In");
    }
  }, []);

  useEffect(() => {
    const totalWords = stickyNotes.reduce(
      (acc, note) => acc + (note.story ? note.story.split(" ").length : 0),
      0
    );
    setNumWords(totalWords);

    const totalUpvotes = stickyNotes.reduce(
      (acc, note) => acc + (note.upvotes || 0),
      0
    );
    setNumUpvotes(totalUpvotes);
  }, [stickyNotes]);

  return (<>
    {(user ? (
      <Link href="/profile">
      <div
        className={`flex justify-end pt-5 pr-7 bg-cream ${ibmPlexMono.className} hover:underline`}
      >
        <p>{username}</p>
      </div>
    </Link>
    ) : (
      <div
        className={`flex justify-end pt-5 pr-7 bg-cream ${ibmPlexMono.className} hover:underline`}
        onClick={() => {
          supabase.auth.signInWithOAuth({
            provider: 'google',
          })
        }}
      >
        <p>{username}</p>
      </div>
    ))}
    
    <div className="min-h-screen flex flex-col items-center">
      <div className="relative w-full">
        <Link href="/profile" className="absolute top-5 right-7">
          <p className={`text-brown ${ibmPlexMono.className} hover:underline`}>
            {username}
          </p>
        </Link>

        {showWelcome && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-1500"
            onClick={() => setShowWelcome(false)}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: showWelcome ? "blur(50px)" : "blur(0px)",
              WebkitBackdropFilter: showWelcome ? "blur(50px)" : "blur(0px)",
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
              <h1
                className={`text-6xl font-bold mb-4 text-gray-900 ${
                  ibmPlexMono.className
                } ${
                  showWelcome ? "opacity-100" : "opacity-0"
                } transition-opacity duration-1000`}
              >
                welcome! today is {new Date().toISOString().split("T")[0]}.
              </h1>

              <p
                className={`text-xl mb-4 text-gray-900 ${
                  ibmPlexMono.className
                } ${
                  showSecondText ? "opacity-100" : "opacity-0"
                } transition-opacity duration-1000`}
              >
                click anywhere to continue.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center mx-12 mt-12 mb-6 max-w-4xl mx-auto text-center">
          <p
            className={`text-brown ${ibmPlexMono.className} text-xl underline`}
          >
            today&apos;s prompt is...
          </p>
          <p
            className={`text-green ${robotoCondensed.className} text-4xl uppercase mt-4`}
          >
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
      </div>

      {showStickyNotes && (
        <div className="flex flex-wrap justify-center gap-6 p-4 mx-auto">
          {stickyNotes.map((note) => (
            <StickyNote
              key={note.id}
              text={note.story}
              author={note.author}
              timestamp={note.created_at}
              upvotes={note.bookmarks}
              id={note.id}
              title={note.title}
              color={green()}
              width={250}
              height={250}
            />
          ))}
        </div>
      )}

      <div className="mb-7"></div>
      <Footer />
    </div>
  </>);
}