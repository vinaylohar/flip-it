import React from 'react';
import { FaLightbulb, FaHighlighter } from 'react-icons/fa';
import './StickyButtons.css';

interface StickyButtonsProps {
  showStickyButtons: boolean;
  onToggleHints: () => void;
  onHighlightHintPair: () => void;
}

const StickyButtons: React.FC<StickyButtonsProps> = ({
  showStickyButtons,
  onToggleHints,
  onHighlightHintPair,
}) => {
  if (!showStickyButtons) return null;

  return (
    <div className="sticky-buttons">
      <button className="icon-button" onClick={onToggleHints} title="Show Hints">
        <FaLightbulb />
      </button>
      <button
        className="icon-button"
        onClick={onHighlightHintPair}
        title="Highlight a Pair"
      >
        <FaHighlighter />
      </button>
    </div>
  );
};

export default StickyButtons;