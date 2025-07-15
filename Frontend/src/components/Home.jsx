import React from "react";
import Spline from "@splinetool/react-spline";
import { motion} from 'framer-motion';
import { useScroll } from "../context/ScrollContext";

const Home = () => {
  const { refs, scrollTo } = useScroll();

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* ✅ Spline 3D Background */}
      <Spline
        scene="https://prod.spline.design/LVRvD2bDiVH3Dfa6/scene.splinecode"
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <div className="absolute bottom-0 left-0 w-full h-32 z-1 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-16 z-1 bg-gradient-to-b from-transparent to-black pointer-events-none" />

      {/* ✅ Content floating above the background */}
      <div className="absolute bottom-0 left-0 w-full z-1 flex justify-start items-end px-6 pb-10 pointer-events-none">
        <div className="mb-[60px] mx-1 ">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl pointer-events-none font-michroma leading-relaxed tracking-wider">
            Welcome to <br /> Investimate.ai
          </h1>
          <p className="text-sm md:text-base opacity-70 mt-5 mb-10">
            AI-Powered Insights for Smarter Investing
          </p>
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            onClick={() =>scrollTo(refs["stockRef"])}
            className="px-6 py-2 bg-gradient-to-r from-[#3fffad] to-[#00d4ff] text-black font-medium rounded-lg text-sm hover:shadow-lg hover:shadow-[#3fffad]/25 transition-all duration-200 pointer-events-auto"
          >
            Get Started with Us
          </motion.button>
        </div>
      </div>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() =>scrollTo(refs["aboutRef"])}
        className="absolute bottom-6 right-5 z-1 bg-black text-white text-lg font-[450] border-gray-300 border-[0.5px] px-5 py-2 rounded-3xl shadow transition duration-300 pointer-events-auto focus:outline-none focus:ring-0
"
      >
        Know more
      </motion.button>
    </div>
  );
};

export default Home;

 



