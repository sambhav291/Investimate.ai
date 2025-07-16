import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Library from './components/Library';
import Footer from './components/Footer';
import { useScroll } from './context/ScrollContext';
import { motion } from 'framer-motion';

const App = () => {
  const { refs } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for OAuth errors in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error === 'oauth_error') {
        errorMessage = `OAuth error: ${message || 'Unknown error'}`;
      } else if (error === 'no_token') {
        errorMessage = 'No authentication token received.';
      } else if (error === 'no_user_info') {
        errorMessage = 'Unable to retrieve user information.';
      } else if (error === 'oauth_failed') {
        errorMessage = `Login failed: ${message || 'Unknown error'}`;
      }
      
      setAuthError(errorMessage);
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-dismiss error after 5 seconds
      setTimeout(() => setAuthError(null), 5000);
    }
  }, []);

  return (
    <>
      <Navbar />
      {/* Auth Error Display */}
      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 20px',
            color: '#dc2626',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            textAlign: 'center'
          }}
        >
          {authError}
          <button
            onClick={() => setAuthError(null)}
            style={{
              marginLeft: '10px',
              color: '#dc2626',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: 'none',
              background: 'none'
            }}
          >
            ×
          </button>
        </motion.div>
      )}
      {/* Global Scroll Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 0.01 ? 1 : 0 }}
        style={{
          width: `${Math.min(scrollProgress * 100, 100)}%`,
          height: '5px',
          position: 'fixed',
          top: '64px', // Adjust if your navbar is a different height
          left: 0,
          zIndex: 50,
          background: 'linear-gradient(90deg, #3fffad 0%, #38bdf8 100%)',
          borderRadius: '0 8px 8px 0',
          boxShadow: '0 2px 8px rgba(56,189,248,0.15)',
          transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1)'
        }}
      />
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


