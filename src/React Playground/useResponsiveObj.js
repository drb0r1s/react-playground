import { useState, useEffect, useCallback, useMemo } from "react";

const useResponsiveObj = (object) => {
    const breakpoints = useMemo(() => {
        return {
            xxs: "(max-width: 319px)",
            xs: "(min-width: 320px) and (max-width: 480px)",
            sm: "(min-width: 481px) and (max-width: 768px)",
            md: "(min-width: 769px) and (max-width: 1024px)",
            lg: "(min-width: 1025px) and (max-width: 1200px)",
            xl: "(min-width: 1201px) and (max-width: 1699px)",
            xxl: "(min-width: 1700px)"
        };
    }, []);
    
    const [currentBreakpoint, setCurrentBreakpoint] = useState("");
    const [responsive, setResponsive] = useState("");

    const checkBreakpoint = useCallback(() => {
        const allBreakpointsKeys = Object.keys(breakpoints);
        const allBreakpoints = Object.values(breakpoints);
        
        let responsiveValue = "";
        
        for(let i = 0; i < allBreakpoints.length; i++) {
            if(window.matchMedia(allBreakpoints[i]).matches) responsiveValue = i;
        }

        setCurrentBreakpoint(allBreakpointsKeys[responsiveValue]);        
    }, [breakpoints]);

    useEffect(checkBreakpoint, [checkBreakpoint]);

    useEffect(() => {
        window.addEventListener("resize", checkBreakpoint);

        return () => { window.removeEventListener("resize", checkBreakpoint) }
    }, [checkBreakpoint]);

    useEffect(() => {
        if(currentBreakpoint) {
            const allObjectKeys = Object.keys(object);
            const allObjectValues = Object.values(object);

            let noBreakpoint = true;

            for(let i = 0; i < allObjectKeys.length; i++) {
                if(currentBreakpoint === allObjectKeys[i]) {
                    setResponsive(allObjectValues[i]);
                    noBreakpoint = false;
                }
            }

            if(noBreakpoint) setResponsive(false);
        }
    }, [currentBreakpoint, object]);

    return { responsive };
}

export default useResponsiveObj;