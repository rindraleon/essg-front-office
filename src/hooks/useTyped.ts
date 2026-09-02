import { useState, useEffect } from 'react';

interface UseTypedOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export const useTyped = (words: readonly string[], options: UseTypedOptions = {}) => {
  const { typeSpeed = 80, deleteSpeed = 40, pauseDuration = 1800 } = options;
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter logic
  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex % words.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, typeSpeed);
      } else {
        // Word is fully typed, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else if (text.length > 0) {
      timer = setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1));
      }, deleteSpeed);
    } else {
      // Word is fully deleted, move to next
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration]);

  return { text, showCursor, wordIndex };
};

export default useTyped;
