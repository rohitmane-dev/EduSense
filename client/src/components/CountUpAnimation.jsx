import { useState, useEffect } from 'react';

/**
 * CountUpAnimation Component
 * Animates a number from 0 to the target value
 */
const CountUpAnimation = ({ target, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const startValue = 0;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function (easeOutExpo)
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentCount = Math.floor(easeOut * (target - startValue) + startValue);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [target, duration]);

    return (
        <span>
            {count}{suffix}
        </span>
    );
};

export default CountUpAnimation;
