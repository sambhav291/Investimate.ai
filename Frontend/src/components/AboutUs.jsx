// import React from "react";

// const AboutUs = () => (
    
//   <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 py-16">
//     <h2 className="text-3xl font-bold text-blue-800 mb-4">About Us</h2>
//     <p className="max-w-2xl text-gray-700 text-lg text-center">
//       investiMate is your AI-powered research companion. It analyzes data from diverse sources,
//       summarizes key insights, and helps you stay ahead in stock market research.
//     </p>
//   </div>
// );

// export default AboutUs;

import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  FileText, 
  Search, 
  Zap, 
  Target, 
  Shield, 
  Award,
  ChevronRight,
  BarChart3,
  Lightbulb,
  Database,
  Clock,
  Users,
  Globe,
  Sparkles
} from "lucide-react";

const AboutUs = () => {
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
          className="absolute top-[200px] left-[100px] w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
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
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-2">
                <Brain className="w-10 h-10 text-white" />
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
                  Investimate transforms complex market data into actionable insights using advanced AI algorithms. Our Mission is To empower every investor with AI-driven insights and professional-grade analysis tools, making sophisticated market research accessible, affordable, and actionable for everyone. We believe that informed decisions lead to better outcomes, and technology should serve to level the playing field in financial markets.
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
                    Our AI analyzes forum discussions, annual reports, and conference calls to generate 
                    comprehensive summaries that highlight key insights and market sentiment.
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
                    Generate professional-grade research reports with detailed analysis, 
                    charts, and recommendations comparable to top brokerage firms.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* How It Works Section */}
          {/* <motion.div
            variants={itemVariants}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Our sophisticated AI pipeline processes multiple data sources to deliver comprehensive market insights
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "Data Collection",
                  description: "Aggregates information from forums, annual reports, and conference calls",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Brain,
                  title: "AI Analysis",
                  description: "Advanced algorithms process and analyze the collected data for patterns and insights",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: FileText,
                  title: "Report Generation",
                  description: "Creates professional reports with visualizations and actionable recommendations",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="w-6 h-6 text-white/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div> */}

          {/* Features Section
          <motion.div
            variants={itemVariants}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Key Features
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Powerful tools designed to enhance your investment research workflow
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Lightning Fast", description: "Generate reports in seconds, not hours" },
                { icon: Target, title: "Precision Analysis", description: "AI-powered insights with high accuracy" },
                { icon: Shield, title: "Secure & Private", description: "Your data is protected with enterprise-grade security" },
                { icon: BarChart3, title: "Visual Reports", description: "Beautiful charts and visualizations" },
                { icon: Clock, title: "Real-time Data", description: "Always up-to-date market information" },
                { icon: Globe, title: "Global Markets", description: "Coverage across multiple stock exchanges" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div> */}

          {/* About the Creator Section */}
          <motion.div
            variants={itemVariants}
            className="mb-20"
          >
            <div className="bg-white/5 backdrop-blur-md  rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  About the Creator
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Meet the visionary behind Investimate's innovative approach to financial technology
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-8 text-center"
                >
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-r from-[#3fffad] to-[#00d4ff] rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Users className="w-12 h-12 text-black" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Passionate Developer & Investor</h3>
                  <p className="text-white/70 text-lg leading-relaxed mb-6">
                    As a dedicated software engineer with a deep passion for financial markets, I created Investimate 
                    to bridge the gap between complex market data and actionable insights. With years of experience 
                    in both technology and finance, I understand the challenges investors face when trying to make 
                    informed decisions in today's fast-paced market environment.
                  </p>
                  <p className="text-white/70 text-lg leading-relaxed mb-6">
                    My vision was to democratize access to professional-grade research tools, making sophisticated 
                    analysis available to individual investors who previously had to rely on expensive brokerage services. 
                    Investimate represents countless hours of research, development, and testing to ensure that every 
                    feature delivers real value to users.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2">
                      <span className="text-[#3fffad] font-semibold">Full-Stack Developer</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2">
                      <span className="text-[#3fffad] font-semibold">AI Enthusiast</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2">
                      <span className="text-[#3fffad] font-semibold">Market Researcher</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Mission Section */}
          {/* <motion.div
            variants={itemVariants}
            className="mb-20"
          >
            <div className="text-center">
              <motion.div
                className="inline-block mb-6"
                variants={floatingVariants}
                animate="float"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#3fffad] to-[#00d4ff] rounded-2xl flex items-center justify-center mx-auto">
                  <Lightbulb className="w-8 h-8 text-black" />
                </div>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
                To empower every investor with AI-driven insights and professional-grade analysis tools, 
                making sophisticated market research accessible, affordable, and actionable for everyone. 
                We believe that informed decisions lead to better outcomes, and technology should serve 
                to level the playing field in financial markets.
              </p>
            </div>
          </motion.div> */}

          {/* CTA Section */}
          {/* <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#3fffad]" />
                <h3 className="text-2xl font-bold text-white">Ready to Transform Your Research?</h3>
                <Sparkles className="w-6 h-6 text-[#3fffad]" />
              </div>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of investors who have already discovered the power of AI-driven market analysis
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#3fffad] to-[#00d4ff] hover:from-[#3fffacd1] hover:to-[#00d5ffd8] text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-blue-500/25"
              >
                <TrendingUp className="w-5 h-5" />
                Start Analyzing Now
              </motion.button>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;