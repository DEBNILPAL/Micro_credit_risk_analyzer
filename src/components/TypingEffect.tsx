import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  className = '',
  typingSpeed = 100,
  erasingSpeed = 50,
  pauseDuration = 2000,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      // Typing phase
      if (displayText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Pause before erasing
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      // Erasing phase
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, erasingSpeed);
      } else {
        // Pause before typing again
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, pauseDuration / 2);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, text, typingSpeed, erasingSpeed, pauseDuration]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Split text into lines for proper display with cursor positioning
  const renderTextWithLineBreaks = () => {
    const words = displayText.split(' ');
    const firstLine = [];
    const secondLine = [];
    
    // Split at "for" to put "Financial Inclusion" on second line
    let foundFor = false;
    for (const word of words) {
      if (word === 'for') {
        firstLine.push(word);
        foundFor = true;
      } else if (foundFor) {
        secondLine.push(word);
      } else {
        firstLine.push(word);
      }
    }

    const cursor = (
      <span 
        className={`inline-block w-0.5 h-[1em] ml-1 bg-black ${
          showCursor ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-100`}
        style={{ 
          verticalAlign: 'baseline',
          transform: 'translateY(0.15em)'
        }}
      />
    );

    return (
      <div className="text-center">
        <div>
          {firstLine.join(' ')}
          {secondLine.length === 0 && cursor}
        </div>
        {secondLine.length > 0 && (
          <div>
            {secondLine.join(' ')}
            {cursor}
          </div>
        )}
      </div>
    );
  };

  return (
    <span className={className}>
      {renderTextWithLineBreaks()}
    </span>
  );
};

export default TypingEffect;
