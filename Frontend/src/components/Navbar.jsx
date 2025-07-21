import React, { useState, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Signup from './Signup';
import { Menu, X, ChevronDown } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import { useScroll } from "../context/ScrollContext";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { token, logout, user, authStatus } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const { refs, scrollTo } = useScroll();
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      setScrolled(scrollY > screenHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Helper: get display name
  const getDisplayName = (user) => {
    if (!user) return null;
    return user.username || user.name || user.email || null;
  };

  // Helper: get avatar src
  const getAvatar = (user) => {
    if (!user) return "/user profile placeholder.png";
    return user.picture || user.profile_pic || "/user profile placeholder.png";
  };

  const navItems = [
    { name: 'Home', ref: 'homeRef' },
    { name: 'Services', ref: 'stockRef' },
    { name: 'Library', ref: 'libraryRef' },
    { name: 'About Us', ref: 'aboutRef' }
  ];

  const navbarVariants = {
    transparent: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      backdropFilter: 'blur(0px)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    },
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px) saturate(150%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    }
  };

  const logoVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: i * 0.1,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, delay: 0.3, ease: "easeOut" }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        animate={scrolled ? "scrolled" : "transparent"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 "
        style={{
          background: scrolled 
            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            : 'transparent'
        }}
      >
        <div className="max-w-90vw mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="flex-shrink-0 cursor-pointer"
                onClick={() => scrollTo(refs.homeRef)}
              >
                <img 
                  src="/Investimate logo full.png" 
                  alt="Investimate" 
                  className="w-[180px] h-auto brightness-110" 
                />
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    custom={index}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollTo(refs[item.ref]);
                    }}
                    className="relative px-4 py-2 text-white/80 hover:text-white border-none focus:ring-0 font-medium text-sm transition-colors duration-200 group"
                  >
                    {item.name}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#3fffad] to-[#00d4ff] origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right side - Auth/Profile */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                {token && user && getDisplayName(user) ? (
                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/3 backdrop-blur-sm  hover:bg-white/5 transition-all duration-200"
                    >
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={getAvatar(user)}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#3fffad]/30"
                      />
                      <span className="font-michrome text-white/90 text-sm">
                        {getDisplayName(user)}
                      </span>
                      <motion.div
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-white/60" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-3 text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
                          >
                            Logout
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : authStatus === 'loading' ? (
                  <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <div className="flex items-center space-x-3">
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => setIsLoginOpen(true)}
                      className="px-6 py-2 text-white/80 hover:text-white border border-white/30 hover:border-white/50 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => setIsSignupOpen(true)}
                      className="px-6 py-2 bg-gradient-to-r from-[#3fffad] to-[#00d4ff] text-black font-medium rounded-lg text-sm hover:shadow-lg hover:shadow-[#3fffad]/25 transition-all duration-200"
                    >
                      Sign Up
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-white p-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1 bg-black/30 backdrop-blur-md border-t border-white/10">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.1, duration: 0.3 }
                    }}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollTo(refs[item.ref]);
                    }}
                    className="text-white/80 hover:text-white block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all duration-200"
                  >
                    {item.name}
                  </motion.button>
                ))}

                <div className="pt-4 border-t border-white/10 mt-4">
                  <div className="flex flex-col space-y-3 px-2">
                    {token && user ? (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full text-left py-3 px-4 rounded-lg text-base font-medium border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        Logout
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsLoginOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-white/80 hover:text-white w-full text-left py-3 px-4 rounded-lg text-base font-medium border border-white/30 hover:bg-white/10 transition-all duration-200"
                        >
                          Login
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsSignupOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="bg-gradient-to-r from-[#3fffad] to-[#00d4ff] text-black w-full py-3 px-4 rounded-lg text-base font-medium hover:shadow-lg hover:shadow-[#3fffad]/25 transition-all duration-200"
                        >
                          Sign Up
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Signup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
};

export default Navbar;