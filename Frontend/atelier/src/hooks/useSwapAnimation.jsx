import { useEffect, useRef, useState } from "react";

/**
 * Флаг короткой анимации при смене зависимостей (например, presetIdx).
 */
export function useSwapAnimation(deps, ms = 250) {
    const [isSwapping, setIsSwapping] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        setIsSwapping(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setIsSwapping(false), ms);
        return () => clearTimeout(timer.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { isSwapping };
}