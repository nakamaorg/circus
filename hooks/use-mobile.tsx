import * as React from "react";



const MOBILE_BREAKPOINT = 768;

/**
 * @description
 * Custom hook to determine if the current device is mobile based on the viewport width.
 * It uses the `matchMedia` API to listen for changes in the viewport width.
 *
 * @returns {boolean} Returns true if the viewport width is less than the defined mobile breakpoint, otherwise false.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
