import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Library from './components/Library';
import Footer from './components/Footer';
import { useScroll } from './context/ScrollContext';

const App = () => {
  const { refs } = useScroll();

  return (
    <>
      <Navbar />
      <div className="scroll-smooth">
        <section ref={refs.homeRef}>
          <Home />
        </section>

        <section ref={refs.stockRef}>
          <Services />
        </section>

        <section ref={refs.libraryRef}>
          <Library />
        </section>

        <section ref={refs.aboutRef}>
          <AboutUs />
        </section>
        
        <section>
          <Footer/>
        </section>
        
      </div>
    </>
  );
};

export default App;









// import React, { useContext, useEffect, useState } from 'react';
// import './App.css';
// import StockSelector from "./components/stock_selector";
// import Navbar from './components/Navbar';
// import { AuthContext } from './context/AuthContext';


// const App = () => null;
// export default App;


