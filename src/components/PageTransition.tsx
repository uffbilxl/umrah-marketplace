import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    window.scrollTo(0, 0);
    setVisible(false);
    const timeout = setTimeout(() => {
      setDisplayedChildren(children);
      setVisible(true);
    }, 150);
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Keep children in sync when not transitioning
  useEffect(() => {
    if (visible) setDisplayedChildren(children);
  }, [children, visible]);

  return (
    <div className={`transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}>
      {displayedChildren}
    </div>
  );
};

export default PageTransition;
