import { useEffect, useState } from 'react';

const breakpoints: Record<string, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

function getMediaQuery(query: 'up' | 'down' | 'between' | 'only', key: string, start?: string, end?: string) {
    if (query === 'up') {
        return `(min-width: ${breakpoints[key]}px)`;
    }
    if (query === 'down') {
        return `(max-width: ${breakpoints[key] - 0.02}px)`;
    }
    if (query === 'between' && start && end) {
        return `(min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end] - 0.02}px)`;
    }
    if (query === 'only') {
        const min = breakpoints[key];
        const keys = Object.keys(breakpoints);
        const idx = keys.indexOf(key);
        const next = keys[idx + 1];
        if (next) {
            return `(min-width: ${min}px) and (max-width: ${breakpoints[next] - 0.02}px)`;
        }
        return `(min-width: ${min}px)`;
    }
    return '';
}

export function useResponsive(query: 'up' | 'down' | 'between' | 'only', key: string, start?: string, end?: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const mediaQuery = getMediaQuery(query, key, start, end);
        if (!mediaQuery) return;
        const mql = window.matchMedia(mediaQuery);
        const handler = () => setMatches(mql.matches);
        handler();
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [query, key, start, end]);
    return matches;
}
