import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window back to the top whenever the route changes.
 * Without this, React Router keeps the browser's current scroll
 * position, so navigating from the bottom of one page (e.g. clicking
 * "View Details" or "Book Now" in the footer of a card list) lands
 * you at the same scroll offset on the next page instead of its top.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
