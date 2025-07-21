import React from "react";
import { motion } from "framer-motion";
import { 
  Brain,  
  FileText, 
  Search, 
  Linkedin,
} from "lucide-react";

const AboutUs = () => {

  const hoverVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  }; 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[250px] left-[100px] w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 150, 0],
            y: [0, -75, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-[200px] right-[100px] w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 75, 0],
            scale: [1.4, 1, 1.4],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-3xl"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-1 container mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-block mb-6"
              variants={floatingVariants}
              animate="float"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto -mb-8">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="text-[#3fffad] drop-shadow-lg">
                Investimate
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing stock market research with AI-powered insights and comprehensive analysis
            </p>
          </motion.div>

          {/* What We Do Section */}
          <motion.div
            variants={itemVariants}
            className="mb-20"
          >
            <div className="bg-white/5 backdrop-blur-md  rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What We Do
                </h2>
                <p className="text-white/70 text-lg max-w-4xl mx-auto">
Simplifying Stock Research with AI-Powered Insights.
Investimate makes complex market data easy to understand by turning scattered information into clear, actionable insights.

We use advanced AI to help individual investors access professional-grade research tools, making stock analysis faster, smarter, and more affordable.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Smart Summarization</h3>
                  </div>
                  <p className="text-white/70">
                    <b>A concise, AI-driven summary—sourced from what actually matters. </b>
Making sense of a stock requires cutting through pages of dense reports, forums, and earnings calls. Our AI does the heavy lifting by scanning and processing content from three high-value sources:<br/> <br />

<li><b>Investor Forums:</b> Capture sentiment, emerging opinions, and key crowd-sourced insights.<br/></li>

<li><b>Annual Reports:</b> Extracts critical financial and strategic highlights from lengthy documents.<br/></li>

<li><b>Concall Transcripts:</b> Distills management commentary, outlook, and analyst Q&A.<br/> </li><br />

All three inputs are algorithmically analyzed and summarized to highlight only the most relevant takeaways—giving you a compact yet comprehensive understanding of the stock’s position and prospects. Whether you're screening or diving deep, our summaries save hours of reading and help you make faster, more informed decisions.
                  </p>
                </motion.div>

                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Brokerage Reports</h3>
                  </div>
                  <p className="text-white/70">
                   <b>Create rich, structured, and presentation-ready reports—instantly. </b>
For investors who want a deeper dive or a shareable report, our report generation engine creates full-fledged, professional-grade PDFs with the click of a button.<br/> <br />

How it works: <br />

<li>We fetch data from the same three pillars—forums, annual reports, and concalls.</li>

<li>Our backend pipeline performs natural language processing and data classification to organize this into multiple structured sections.</li>

<li>The content is curated, ranked for relevance, and formatted into a visually compelling layout.</li>

<li>A downloadable PDF is generated automatically—with polished UI, clear headers, and investor-friendly insights.
</li>
<br />
These reports mirror the depth and layout of traditional brokerage research, but are fully automated, personalized, and free from jargon. Use them to guide your own decisions, share with peers, or archive your research.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* About the Creator Section */}
          <motion.div
            variants={itemVariants}
            className="mb-20"
          >
            <div className="bg-white/5 backdrop-blur-md  rounded-3xl p-8 md:pt-6 md:pb-10">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  About the Creator
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Built by a curious developer with a passion for tech and finance
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-8 text-center"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start text-left gap-8">
                    {/* Photo + Name */}
                    <div className="flex flex-col items-center min-w-[140px]">
                      <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-1 rounded-full">
                        <div className="bg-black rounded-full p-0">
                          <img
                            src="/sambhav_profile.jpg"
                            alt="Sambhav"
                            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-transparent"
                          />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4 mb-3 text-center">Sambhav</h3>
                      <motion.a
                        href="https://www.linkedin.com/in/sambhav-magotra-3a6187258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                        variants={hoverVariants}
                        whileHover="hover"
                      >
                        <div className="bg-gradient-to-r from-blue-600/25 to-blue-500/25 backdrop-blur-md rounded-lg flex items-center justify-center hover:from-blue-500/35 hover:to-blue-400/35 transition-all duration-300 p-2 px-3 border border-blue-400/20">
                        <span className="text-sm font-medium text-blue-300">Let's Connect</span>
                          <Linkedin className="w-4 h-4 text-blue-300 ml-2" />                         
                        </div>
                        
                      </motion.a>
                    </div>
                    {/* Written Content */}
                    <div className="flex-1 flex flex-col justify-start">
                      <p className="text-white/70 text-lg leading-relaxed mb-6">
                        I'm Sambhav Magotra, a passionate software engineer and full-stack developer from Maharaja Agrasen Institute of Technology, Delhi. I love experimenting with new technologies and building meaningful projects that solve real-world problems. My curiosity drives me to constantly learn, explore, and create.
                      </p>
                      <p className="text-white/70 text-lg leading-relaxed mb-6">
                        Creating Investimate.ai was a personal mission — blending my love for technology with a growing interest in financial markets. This platform is the result of hands-on development, curiosity-driven learning, and the belief that powerful tools should be within everyone's reach.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;