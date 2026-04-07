import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="animate-fade-in" style={{ animationDuration: "200ms" }}>
      {children}
    </div>
  );
};

export default PageTransition;
