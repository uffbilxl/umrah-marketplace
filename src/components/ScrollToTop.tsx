import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setFadeIn(false);
    const frame = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-200 ${fadeIn ? "opacity-100" : "opacity-0"}`}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998 }}
    />
  );
};

export default ScrollToTop;
