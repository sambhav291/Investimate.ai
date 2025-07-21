import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin} from 'lucide-react';

const Footer = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const hoverVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 ">
        <motion.div
          className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-1 container ">
        <motion.div
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md p-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand Section */}
            <motion.div 
              className="flex items-center gap-3"
              variants={itemVariants}
            >
              <motion.div
                className="w-12 h-12  flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {/* <TrendingUp className="w-6 h-6 text-white" /> */}
                <img src="/Investimate logo.png" alt="" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white">Investimate</h3>
                <p className="text-white/60 text-sm">AI-Powered Stock Analysis</p>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div 
              className="flex items-center gap-6"
              variants={itemVariants}
            >
              <div className="text-center md:text-right">
                <p className="text-white/60 text-sm mb-2">Get in touch</p>
                <div className="flex items-center gap-4">
                  <motion.a
                    href="mailto:sambhavmagotra009@gmail.com"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    variants={hoverVariants}
                    whileHover="hover"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="hidden md:inline">sambhavmagotra009@gmail.com</span>
                  </motion.a>
                  
                  <motion.a
                    href="https://www.linkedin.com/in/sambhav-magotra-3a6187258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    variants={hoverVariants}
                    whileHover="hover"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <span className="hidden md:inline">LinkedIn</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="mt-8 pt-6 border-t border-white/10 text-center"
            variants={itemVariants}
          >
            <p className="text-white/40 text-sm">
              © 2025 investimate. All rights reserved. | Powered by AI for smarter investing.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;