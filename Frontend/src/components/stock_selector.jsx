import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from '../context/AuthContext.jsx';
import Login from './Login.jsx';

const StockSelector = ({
  inputStock,
  setInputStock,
  summaries,
  setSummaries, 
  summaryLoading,
  summaryError,
  handleGenerateSummary, 
  reportLoading,
  pdfError,
  handleGenerateReport,
}) => {
  const [activeTab, setActiveTab] = useState('combined');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { token } = useContext(AuthContext);


  const handleGenerateReportWithAuth = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    handleGenerateReport();
  };

  const handleGenerateSummaryWithAuth = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    handleGenerateSummary();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputStock.trim() && !summaryLoading && !reportLoading) {
      // This now calls the function passed down from Services.jsx
      handleGenerateSummaryWithAuth();
    }
  };
  
  const handleCloseSummary = () => {
    setSummaries({ forum: "", annual: "", concall: "", combined: "" });
  };


  const getTabIcon = (tab) => {
    const icons = { combined: '🔄', annual: '📊', concall: '🎧', forum: '💬' };
    return icons[tab] || '📄';
  };

  const getTabLabel = (tab) => {
    const labels = { combined: 'Combined Summary', annual: 'Annual Report', concall: 'Concall Transcript', forum: 'Investor Forum' };
    return labels[tab] || tab;
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
  const glowVariants = { glow: { boxShadow: ['0 0 20px rgba(63, 255, 173, 0.2)', '0 0 40px rgba(63, 255, 173, 0.3)', '0 0 20px rgba(63, 255, 173, 0.2)'], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } } };
  const tabVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.3 } } };

  return (
    <motion.div
      className="p-6 mx-auto max-w-[85vw] space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl "
        variants={itemVariants}
        whileHover={{
          scale: 1.01,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
          borderColor: 'rgba(63, 255, 173, 0.3)',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-end">
          <motion.div className="flex-grow" variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Stock Symbol
            </label>
            <motion.div className="relative">
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL, TSLA, JSW)"
                value={inputStock}
                onChange={(e) => setInputStock(e.target.value)}
                onKeyUp={handleKeyPress}
                className="w-full bg-black/50 border-2 border-gray-600/50 rounded-2xl p-6 text-white text-lg placeholder-gray-400 focus:border-[#3fffad] focus:ring-4 focus:ring-[#3fffad]/20 transition-all duration-300 backdrop-blur-sm h-12"
                disabled={summaryLoading || reportLoading}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-[#3fffad]/0 pointer-events-none"
                whileFocus={{ borderColor: 'rgba(63, 255, 173, 0.5)' }}
                variants={glowVariants}
                animate={inputStock ? 'glow' : ''}
              />
            </motion.div>
          </motion.div>

          <div className="flex gap-4 items-end">
            <motion.button
              onClick={handleGenerateSummaryWithAuth}
              disabled={!inputStock || summaryLoading || reportLoading}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600/50 to-purple-600/40 hover:from-blue-500/40 hover:to-purple-500/40 disabled:from-blue-600/50 disabled:to-purple-600/40 backdrop-blur-md border border-blue-400/25 text-blue-300 hover:text-blue-200 disabled:text-blue-300/80 py-3 px-8 rounded-3xl font-semibold disabled:cursor-not-allowed transition-all duration-300 w-auto md:min-w-[180px] h-auto md:h-12 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative z-10 flex items-center justify-center gap-2 font-normal">
                {summaryLoading ? 'Analyzing...' : (
                  <>
                    <span>🔍</span>
                    Generate Analysis
                  </>
                )}
              </div>
            </motion.button>

            <motion.button
              onClick={handleGenerateReportWithAuth}
              disabled={!inputStock || summaryLoading || reportLoading}
              className="relative overflow-hidden bg-gradient-to-r from-green-500/50 to-emerald-500/30 hover:from-emerald-400/40 hover:to-green-400/40 disabled:from-green-500/50 disabled:to-emerald-500/30 backdrop-blur-md border border-emerald-400/25 text-emerald-300 hover:text-emerald-200 disabled:text-emerald-300/80 py-3 px-8 rounded-3xl font-normal disabled:cursor-not-allowed transition-all duration-300 min-w-[180px] h-auto md:h-12 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(63, 255, 173, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {reportLoading ? 'Creating PDF...' : (
                  <>
                    <span>📊</span>
                    Generate Report
                  </>
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {(summaryError || pdfError) && (
          <motion.div
            className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-red-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{summaryError || pdfError}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!summaryLoading && summaries.combined && (
          <motion.div
            className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl border border-white/10"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                    Analysis for {inputStock.toUpperCase()}
                </h3>
                <motion.button
                    onClick={handleCloseSummary}
                    className="text-white/60 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <span className="text-2xl">✕</span>
                </motion.button>
            </div>
            <nav className="flex flex-wrap justify-center gap-2 mb-6">
              {['combined', 'annual', 'concall', 'forum'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'bg-[#3fffad] text-black border-[#3fffad]'
                      : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-[#3fffad]/50'
                  } px-6 py-3 rounded-2xl font-medium text-sm border-2 transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-center`}
                >
                  <span>{getTabIcon(tab)}</span>
                  {getTabLabel(tab)}
                </motion.button>
              ))}
            </nav>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="prose prose-invert max-w-none text-gray-100 leading-relaxed">
                  <ReactMarkdown>{summaries[activeTab]}</ReactMarkdown>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-3">Login Required</h3>
              <p className="text-white/70 mb-6">You need to log in to generate PDF reports.</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl"
                  onClick={() => {
                    setShowLoginPrompt(false);
                    setIsLoginOpen(true);
                  }}
                >
                  Log In
                </motion.button>
                <motion.button
                  className="bg-white/10 text-white font-semibold py-3 px-6 rounded-xl border border-white/20"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </motion.div>
  );
};


StockSelector.propTypes = {
  inputStock: PropTypes.string.isRequired,
  setInputStock: PropTypes.func.isRequired,
  summaries: PropTypes.object.isRequired,
  setSummaries: PropTypes.func.isRequired,
  summaryLoading: PropTypes.bool.isRequired,
  summaryError: PropTypes.string,
  handleGenerateSummary: PropTypes.func.isRequired,
  reportLoading: PropTypes.bool.isRequired,
  pdfError: PropTypes.string,
  handleGenerateReport: PropTypes.func.isRequired,
};

export default StockSelector;











