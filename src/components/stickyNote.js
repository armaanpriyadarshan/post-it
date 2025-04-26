import React from 'react';
import PropTypes from 'prop-types';

const StickyNote = ({ text, color, width, height }) => {
  const stickyNoteStyle = {
    backgroundColor: color,
    width: `${width}px`,
    height: `${height}px`,
    padding: '10px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    color: '#333',
    overflow: 'hidden',
    wordWrap: 'break-word',
  };

  return <div style={stickyNoteStyle}>{text}</div>;
};

StickyNote.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

StickyNote.defaultProps = {
  color: '#FFEB3B', // Default sticky note color (yellow)
  width: 200, // Default width
  height: 200, // Default height
};

export default StickyNote;