import { useState, useEffect } from 'react';

export const useMobileView = (breakpoint = 640) => {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < breakpoint);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobileView;
}; 