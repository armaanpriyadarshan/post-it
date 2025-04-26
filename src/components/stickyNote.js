"use client";
import React from 'react';
import PropTypes from 'prop-types';

const StickyNote = ({ text, color, width, height, fontClass }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapse = (event) => {
    if (event.target.className.includes("overlay")) {
      setExpanded(false);
    }
  };

  const handleUpvote = () => {
    console.log("Upvote button clicked!"); // Placeholder for upvote functionality
  };

  const stickyNoteStyle = {
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

  const buttonStyle = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '12px',
  };

  return (
    <>
      <div
        className={`overlay fixed inset-0 flex items-center justify-center z-10 ${
          expanded ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Subtle dark layer with 20% opacity
          transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out', // Smooth fade-in/out for the overlay
        }}
        onClick={handleCollapse}
      >
        <div
          className="expanded-sticky-note bg-white p-6 rounded-lg shadow-lg"
          style={{
            backgroundColor: color,
            width: expanded ? '50vw' : `${width}px`, // Animate width
            height: expanded ? '50vw' : `${height}px`, // Animate height
            transition: 'all 0.3s ease-in-out', // Smooth transition for size
            position: 'relative', //put button on note
          }}
        >
          <p
            className={fontClass}
            style={{
              color: '#333',
              fontSize: '18px',
              wordWrap: 'break-word',
              paddingLeft: expanded ? '20px' : '0', // Add left padding when expanded
              paddingTop: expanded ? '20px' : '0', // Add top padding when expanded
            }}
          >
            {text}
          </p>
          <button style={buttonStyle} onClick={handleUpvote}>
            Upvote
            </button>
        </div>
      </div>

      <div
        className={`sticky-note ${fontClass} duration-300 transform hover:scale-105 transition-all ease-in-out`}
        style={stickyNoteStyle}
        onClick={handleExpand}
      >
        {text}
      </div>
    </>
  );
};

StickyNote.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  fontClass: PropTypes.string,
};

StickyNote.defaultProps = {
  color: '#FFEB3B',
  width: 200,
  height: 200,
  fontClass: '',
};

export default StickyNote;