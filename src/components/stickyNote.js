"use client";

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { supabase } from "@/lib/supabaseClient";
import { IBM_Plex_Mono } from "next/font/google";

// fonts
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const ibmPlexMonoBold = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const StickyNote = ({ text, author, timestamp, bookmarks, title, id, color, width, height, user }) => {
  const [expanded, setExpanded] = useState(false);
  const [votes, setVotes] = useState(bookmarks || 0);
  const [hovering, setHovering] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapse = (event) => {
    const targetClassName = event.target.className;
    if (typeof targetClassName === "string" && targetClassName.includes("overlay")) {
      setExpanded(false);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();

    if (!user) {
      supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      return;
    } 


    const {data, error} = await supabase
        .from("users")
        .select("bookmarked")
        .eq("id", user.id)
        .single();

    if (error) {
      console.error("Error fetching user bookmarks:", error.message);
      return;
    }

    
    const ogVotes = votes;
    setVotes(isBookmarked ? ogVotes - 1 : ogVotes + 1);

    const bookmarks = data.bookmarked || [];
    const updatedBookmarks = isBookmarked ? bookmarks.filter((bookmark) => bookmark !== id) : [...bookmarks, id];

    const { error: updateError } = await supabase
      .from("users")
      .update({ bookmarked: updatedBookmarks })
      .eq("id", user.id);
    
    if (updateError) {
      console.error("Error updating user bookmarks:", updateError.message);
      return;
    }

    const { error: noteError } = await supabase
      .from("notes")
      .update({ bookmarks: isBookmarked ? ogVotes - 1 : ogVotes + 1 })
      .eq("id", id);
    
    if (noteError) {
      console.error("Error updating note bookmarks:", noteError.message);
      return;
    }

    setIsBookmarked(!isBookmarked);
  };

  const littleNote = {
    backgroundColor: color,
    width: `${width}px`,
    height: `${height}px`,
    padding: '10px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    fontSize: '14px',
    color: '#333',
    overflow: 'hidden',
    wordWrap: 'break-word',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    position: 'relative',
  };

  const overlay = {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
  };

  const bigNote = {
    backgroundColor: color,
    width: expanded ? '75vw' : `${width}px`,
    height: expanded ? '90vh' : `${height}px`,
    transition: 'all 0.3s ease-in-out',
    overflow: 'auto',
    paddingLeft: expanded ? '40px' : '0',
    paddingTop: expanded ? '40px' : '0',
    position: 'relative',
  };

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const { data, error } = await supabase
      .from("users")
      .select("bookmarked")
      .eq("id", user.id)
      .single();
      
      if (error) {
        console.error("Error fetching user bookmarks:", error.message);
      }

      if (data) {
        const bookmarks = data.bookmarked || [];
        const isBookmarked = bookmarks.map((s) => parseInt(s, 10)).includes(id);
        setIsBookmarked(isBookmarked);
      }
    };

    if (user) {
      fetchBookmarkStatus();
    }
  }, [user]);

  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("bookmarks")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching votes:", error.message);
      }

      if (data) {
        setVotes(data.bookmarks || 0);
      }
    };

    fetchVotes();
  }, [isBookmarked]);

  return (
    <>
      {/* overlay */}
      <div
        className={`overlay fixed inset-0 flex items-center justify-center z-10 ${
          expanded ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={overlay}
        onClick={handleCollapse}
      >
        <div
          className="expanded-sticky-note bg-white p-6 rounded-lg shadow-lg flex flex-col"
          style={bigNote}
        >
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${ibmPlexMonoBold.className}`} style={{ color: '#333', marginBottom: '10px' }}>
              {title}
            </h2>
            {author && (
              <h3 className={`${ibmPlexMono.className} mr-2`}>
                by {author}
              </h3>
            )}
          </div>

          <p
            className={ibmPlexMono.className}
            style={{
              color: '#333',
              fontSize: '18px',
              wordWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          />

          <div className="flex-grow-1"></div>

          <div className="flex justify-between items-center mt-4">
            <span className={`text-sm ${ibmPlexMono.className}`} style={{ color: '#333' }}>
              {new Date(timestamp).toLocaleString()}
            </span>
            <span className={`${ibmPlexMono.className}`} style={{ color: '#333' }}>
              <button 
                onClick={handleBookmark}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                className="text-black rounded-full transition-colors duration-300"
              >
                {isBookmarked || hovering ? (
                  <IoBookmark size={20} />
                ) : (
                  <IoBookmarkOutline size={20} />
                )}
                <span>{votes}</span>
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* collapsed sticky note */}
      <div
        className={`sticky-note ${ibmPlexMono.className} duration-300 transform hover:scale-105 transition-all ease-in-out`}
        style={littleNote}
        onClick={handleExpand}
      >
        <div className="flex justify-center items-center mb-1">
          <span className={`font-bold ${ibmPlexMonoBold.className}`} style={{ color: '#333' }}>
            {title}
          </span>
        </div>
        <span dangerouslySetInnerHTML={{ __html: text }} className={`${ibmPlexMono.className}`} style={{ color: '#333' }}></span>
      </div>
    </>
  );
};

StickyNote.propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.string,
  timestamp: PropTypes.string,
  bookmarks: PropTypes.number,
  title: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  id: PropTypes.number,
};

export default StickyNote;