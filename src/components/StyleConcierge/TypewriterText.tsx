import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

const TypewriterText = ({ text, className = "", speed = 38, onComplete }: TypewriterTextProps) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const words = text.split(" ");

  useEffect(() => {
    setDisplayedWords([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        setDisplayedWords(prev => [...prev, words[i]]);
        i++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayedWords.join(" ")}
      {displayedWords.length < words.length && (
        <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle" style={{ animation: "typewriter-cursor 0.8s step-end infinite" }} />
      )}
    </span>
  );
};

export default TypewriterText;
