"use client";
import React from 'react';
import PropTypes from 'prop-types';
import { IoCaretUpOutline } from "react-icons/io5";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { IBM_Plex_Mono} from "next/font/google";

//fonts
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

const StickyNote = ({ text, author, timestamp, upvotes, title, id, color, width, height }) => {
  //states
  const [expanded, setExpanded] = React.useState(false);
  const [votes, setVotes] = useState(upvotes || 0);

  //handlers
  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapse = (event) => {
    const targetClassName = event.target.className;
    if (typeof targetClassName === "string" && targetClassName.includes("overlay")) {
      setExpanded(false);
    }
  };

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .update({ upvotes: upvotes ? upvotes + 1 : 0 })
      .eq("id", id);

    if (error) {
      console.error("Error upvoting:", error);
    }
    setVotes(upvotes + 1);
  };

  //styles
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
    transition: 'transform 0.3s ease-in-out', // Smooth transition for hover effects
    position: 'relative', // Ensure the button is positioned correctly
  };

  const overlay = {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Subtle dark layer with 20% opacity
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out', // Smooth fade-in/out for the overlay
  }

  const bigNote = {
    backgroundColor: color,
    width: expanded ? '75vw' : `${width}px`, // Animate width
    height: expanded ? '90vh' : `${height}px`, // Animate height
    transition: 'all 0.3s ease-in-out', // Smooth transition for size
    overflow: 'auto',
    paddingLeft: expanded ? '40px' : '0', // Add left padding when expanded
    paddingTop: expanded ? '40px' : '0', // Add top padding when expanded
    position: 'relative', //put button on note
  };

  return (
    <>
        {/* overlay when expanded sticky note */}
      <div
        className={`overlay fixed inset-0 flex items-center justify-center z-10 ${
          expanded ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={overlay}
        onClick={handleCollapse}
      >
        {/* expanded sticky note*/}
        <div
          className="expanded-sticky-note bg-white p-6 rounded-lg shadow-lg po flex flex-col"
          style={bigNote}
        >
          <div className="flex justify-between items-center">
            <h2
              className={`text-2xl font-bold ${ibmPlexMonoBold.className}`}
              style={{
                color: '#333',
                marginBottom: '10px',
              }}
            >
              {title}
            </h2>
            
            {author && (
            <h3 className={`${ibmPlexMono.className} mr-2`}>
              By {author}
            </h3>)}
          </div>

          <p
            className={ibmPlexMono.className}
            style={{
              color: '#333',
              fontSize: '18px',
              wordWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          >
          </p>

          <div className="flex-grow-1"></div>

          <div className="flex justify-between items-center mt-4">
            <span className={`text-sm ${ibmPlexMono.className}`} style={{ color: '#333' }}>
              {new Date(timestamp).toLocaleString()}
            </span>
            <span className={`${ibmPlexMono.className}`} style={{ color: '#333' }}>
              <button 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                className="text-black rounded-full hover:text-white"
                onClick={handleUpvote}>
                <IoCaretUpOutline />
                {votes}

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
          <span
            className={`font-bold ${ibmPlexMonoBold.className}`}
            style={{
              color: '#333',
            }}
          >
            {title}
          </span>
        </div>
        
        <span dangerouslySetInnerHTML={{ __html: text }} className={`${ibmPlexMono.className}`} style={{ color: '#333' }}></span>
      </div>
    </>
  );
};

//defining props
StickyNote.propTypes = {
    text: PropTypes.string.isRequired,
    author: PropTypes.string,
    timestamp: PropTypes.string,
    upvotes: PropTypes.number,
    title: PropTypes.string,
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
};

export default StickyNote;