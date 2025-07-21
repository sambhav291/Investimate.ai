
// Not required for navbar on a single scrollable page 
import React from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;