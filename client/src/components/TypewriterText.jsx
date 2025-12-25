import { useState, useEffect } from 'react';

/**
 * TypewriterText Component
 * Displays text with a typewriter effect, character by character
 * Similar to ChatGPT's streaming response
 */
const TypewriterText = ({
    text,
    speed = 20, // milliseconds per character
    className = '',
    onComplete = null,
    startDelay = 0 // delay before starting animation
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Reset when text changes
        setDisplayedText('');
        setCurrentIndex(0);
        setIsComplete(false);
    }, [text]);

    useEffect(() => {
        if (!text || currentIndex >= text.length) {
            if (!isComplete && currentIndex > 0) {
                setIsComplete(true);
                if (onComplete) {
                    onComplete();
                }
            }
            return;
        }

        const timer = setTimeout(() => {
            setDisplayedText(text.substring(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
        }, currentIndex === 0 ? startDelay : speed);

        return () => clearTimeout(timer);
    }, [currentIndex, text, speed, startDelay, isComplete, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {!isComplete && <span className="animate-pulse">▊</span>}
        </span>
    );
};

export default TypewriterText;
