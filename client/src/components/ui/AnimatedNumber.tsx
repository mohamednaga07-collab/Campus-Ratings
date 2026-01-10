import { useEffect, useState } from "react";

interface AnimatedNumberProps {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export function AnimatedNumber({ value, className, prefix = "", suffix = "", decimals = 0 }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let running = true;
        const animate = () => {
            setDisplayValue((prev) => {
                const diff = value - prev;
                // Stop animation if close enough
                if (Math.abs(diff) < (1 / Math.pow(10, decimals + 1))) return value;
                // Smooth easing factor
                return prev + diff * 0.08;
            });
            if (running) {
                setTimeout(animate, 1000 / 120);
            }
        };
        animate();
        return () => { running = false; };
    }, [value, decimals]);

    return (
        <span className={className}>
            {prefix}{displayValue.toFixed(decimals)}{suffix}
        </span>
    );
}
