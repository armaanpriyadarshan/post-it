"use client";

import React, { useState } from 'react';
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

const StickyNote = ({ text, author, timestamp, bookmarks, title, id, color, width, height }) => {
  const [expanded, setExpanded] = useState(false);
  const [votes, setVotes] = useState(bookmarks || 0);
  const [hovering, setHovering] = useState(false);

  const isBookmarked = votes > 0;

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

    const newVotes = votes > 0 ? 0 : 1;

    const { error } = await supabase
      .from("notes")
      .update({ bookmarks: newVotes })
      .eq("id", id);

    if (error) {
      console.error("Error bookmarking:", error.message);
      return;
    }

    setVotes(newVotes);
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