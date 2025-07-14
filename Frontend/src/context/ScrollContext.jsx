import React, { createContext, useContext, useRef } from "react";
import PropTypes from "prop-types";

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const stockRef = useRef(null);
  const libraryRef = useRef(null);

  const scrollTo = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ScrollContext.Provider
      value={{ refs: { homeRef, aboutRef, stockRef, libraryRef }, scrollTo }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

ScrollProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useScroll = () => useContext(ScrollContext);

