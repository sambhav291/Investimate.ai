import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from '../context/AuthContext.jsx';
import Login from './Login.jsx';

// --- CHANGE 1: SIMPLIFY PROPS ---
// We are removing all the 'set...' functions and other props that are no longer needed
// because this component will not manage its own state for API data.
const StockSelector = ({
  inputStock,
  setInputStock,
  summaries,
  setSummaries, // Keep this one to allow closing the summary
  summaryLoading,
  summaryError,
  handleGenerateSummary, // This prop is now correctly expected
  reportLoading,
  pdfError,
  handleGenerateReport,
}) => {
  const [activeTab, setActiveTab] = useState('combined');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { token } = useContext(AuthContext);

  // --- CHANGE 2: REMOVE ALL API LOGIC ---
  // All of the following have been REMOVED from this file:
  // - useState for summaryJobId, reportJobId, pollingStatus, etc.
  // - useEffect hooks for polling job statuses.
  // - The async handleGenerateSummary and handleGenerateReport functions that call the API.
  // This logic now lives exclusively in Services.jsx.

  const handleGenerateReportWithAuth = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    // This now calls the function passed down from Services.jsx
    handleGenerateReport();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputStock.trim() && !summaryLoading && !reportLoading) {
      // This now calls the function passed down from Services.jsx
      handleGenerateSummary();
    }
  };
  
  // --- CHANGE 3: ADD A HANDLER TO CLOSE THE SUMMARY VIEW ---
  const handleCloseSummary = () => {
    // We call the setSummaries function from the parent to clear the data,
    // which will hide the summary component.
    setSummaries({ forum: "", annual: "", concall: "", combined: "" });
  };

  // --- NO CHANGES BELOW THIS LINE to helper functions or JSX ---

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
              onClick={handleGenerateSummary}
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

// --- CHANGE 4: UPDATE PROPTYPES ---
// The prop types are updated to reflect the new, simplified props.
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















// import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
// import PropTypes from "prop-types";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactMarkdown from 'react-markdown'; // <-- ADDED THIS IMPORT
// import { AuthContext } from "../context/AuthContext";
// import { useFetchWithAuth } from "../utils/fetchWithAuth";
// import Login from './Login';
// import { API_ENDPOINTS } from '../utils/apiConfig';

// const StockSelector = ({
//   inputStock,
//   setInputStock,
//   summaries,
//   setSummaries,
//   summaryLoading,
//   setSummaryLoading,
//   summaryError,
//   setSummaryError,
//   reportLoading,
//   setReportLoading,
//   pdfError,
//   setPdfError,
//   showPdfPreview,
//   setShowPdfPreview,
//   storagePath,
//   setStoragePath,
// }) => {
//   const [activeTab, setActiveTab] = useState("combined");
//   const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [showSummary, setShowSummary] = useState(false);
//   const { token } = useContext(AuthContext);
//   const fetchWithAuth = useFetchWithAuth();
//   const lastFetchedPathRef = useRef("");
//   const [isLoginOpen, setIsLoginOpen] = useState(false);

//   const [summaryJobId, setSummaryJobId] = useState(null);
//   const [reportJobId, setReportJobId] = useState(null);
//   const [pollingStatus, setPollingStatus] = useState('');

//   useEffect(() => {
//     if (!summaryLoading && summaries.combined) {
//       setShowSummary(true);
//     }
//   }, [summaryLoading, summaries.combined]);

//   useEffect(() => {
//     let didCancel = false;
//     const fetchPdf = async () => {
//       if (!showPdfPreview || !storagePath) {
//         setPdfBlobUrl(null);
//         lastFetchedPathRef.current = "";
//         return;
//       }
//       if (lastFetchedPathRef.current === storagePath) return;

//       try {
//         const res = await fetchWithAuth(`${API_ENDPOINTS.previewPdf}?storage_path=${encodeURIComponent(storagePath)}`);
//         if (!res.ok) throw new Error(`Failed to fetch PDF. Status: ${res.status}`);
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         if (!didCancel) {
//           setPdfBlobUrl(prevUrl => {
//             if (prevUrl) URL.revokeObjectURL(prevUrl);
//             return url;
//           });
//           lastFetchedPathRef.current = storagePath;
//         }
//       } catch (err) {
//         if (!didCancel) {
//           console.error("Error fetching PDF preview:", err);
//           setPdfError(err.message);
//         }
//       }
//     };
//     fetchPdf();
//     return () => { didCancel = true; };
//   }, [showPdfPreview, storagePath, fetchWithAuth, setPdfError]);

//   const pollJobStatus = useCallback(async (jobId, statusUrl, onComplete, onError) => {
//     try {
//       const res = await fetchWithAuth(`${statusUrl}/${jobId}`);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const result = await res.json();

//       if (result.status === 'completed') {
//         onComplete(result.data);
//         return true;
//       } else if (result.status === 'failed') {
//         throw new Error(result.error || 'Job failed on the server.');
//       } else {
//         setPollingStatus(`Processing... Status: ${result.status || 'running'}`);
//         return false;
//       }
//     } catch (err) {
//       onError(err.message);
//       return true;
//     }
//   }, [fetchWithAuth]);

//   useEffect(() => {
//     if (!summaryJobId) return;

//     const intervalId = setInterval(async () => {
//       const isFinished = await pollJobStatus(
//         summaryJobId,
//         API_ENDPOINTS.summaryStatus,
//         (data) => {
//           setSummaries(data);
//           setSummaryLoading(false);
//           setPollingStatus('');
//           setSummaryJobId(null);
//         },
//         (errorMsg) => {
//           setSummaryError(errorMsg);
//           setSummaryLoading(false);
//           setPollingStatus('');
//           setSummaryJobId(null);
//         }
//       );
//       if (isFinished) clearInterval(intervalId);
//     }, 10000);

//     return () => clearInterval(intervalId);
//   }, [summaryJobId, pollJobStatus, setSummaries, setSummaryLoading, setSummaryError]);

//   useEffect(() => {
//     if (!reportJobId) return;

//     const intervalId = setInterval(async () => {
//       const isFinished = await pollJobStatus(
//         reportJobId,
//         API_ENDPOINTS.reportStatus,
//         (data) => {
//           setShowPdfPreview(true);
//           setStoragePath(data.storage_path);
//           setReportLoading(false);
//           setPollingStatus('');
//           setReportJobId(null);
//         },
//         (errorMsg) => {
//           setPdfError(errorMsg);
//           setReportLoading(false);
//           setPollingStatus('');
//           setReportJobId(null);
//         }
//       );
//       if (isFinished) clearInterval(intervalId);
//     }, 10000);

//     return () => clearInterval(intervalId);
//   }, [reportJobId, pollJobStatus, setReportLoading, setPdfError, setShowPdfPreview, setStoragePath]);

//   // Cleanup blob URL on component unmount
//   useEffect(() => {
//     return () => {
//       if (pdfBlobUrl) {
//         URL.revokeObjectURL(pdfBlobUrl);
//       }
//     };
//   }, [pdfBlobUrl]);

//   const handleGenerateSummary = async () => {
//     if (!inputStock) {
//       setSummaryError('Please enter a stock name.');
//       return;
//     }
//     setSummaryLoading(true);
//     setSummaryError('');
//     setSummaries({});
//     setShowSummary(false);
//     setPollingStatus('Starting summary generation...');

//     try {
//       const res = await fetchWithAuth(API_ENDPOINTS.generateSummary, {
//         method: 'POST',
//         body: JSON.stringify({ stock_name: inputStock }),
//       });
//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.detail || 'Failed to start summary generation.');
//       }
//       const { job_id } = await res.json();
//       setSummaryJobId(job_id);
//       setPollingStatus('Summary generation is in progress. Please wait...');
//     } catch (err) {
//       setSummaryError(err.message);
//       setSummaryLoading(false);
//       setPollingStatus('');
//     }
//   };

//   const handleGenerateReport = async () => {
//     if (!inputStock) {
//       setPdfError('Please enter a stock name to generate a report.');
//       return;
//     }
//     setReportLoading(true);
//     setPdfError('');
//     setShowPdfPreview(false);
//     setPollingStatus('Starting report generation...');

//     try {
//       const res = await fetchWithAuth(API_ENDPOINTS.generateReport, {
//         method: 'POST',
//         body: JSON.stringify({ stock_name: inputStock }),
//       });
//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.detail || 'Failed to start report generation.');
//       }
//       const { job_id } = await res.json();
//       setReportJobId(job_id);
//       setPollingStatus('Report generation is in progress. This may take several minutes...');
//     } catch (err) {
//       setPdfError(err.message);
//       setReportLoading(false);
//       setPollingStatus('');
//     }
//   };

//   const handleCloseSummary = () => {
//     setShowSummary(false);
//   };

//   const handleGenerateReportWithAuth = () => {
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     handleGenerateReport();
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && inputStock.trim() && !summaryLoading && !reportLoading) {
//       handleGenerateSummary();
//     }
//   };

//   const getTabIcon = (tab) => {
//     const icons = { combined: "🔄", annual: "📊", concall: "🎧", forum: "💬" };
//     return icons[tab] || "📄";
//   };

//   const getTabLabel = (tab) => {
//     const labels = { combined: "Combined Summary", annual: "Annual Report", concall: "Concall Transcript", forum: "Investor Forum" };
//     return labels[tab] || tab;
//   };

//   const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } } };
//   const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
//   const glowVariants = { glow: { boxShadow: ["0 0 20px rgba(63, 255, 173, 0.2)", "0 0 40px rgba(63, 255, 173, 0.3)", "0 0 20px rgba(63, 255, 173, 0.2)"], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } } };
//   const tabVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.3 } } };

//   return (
//     <motion.div
//       className="p-6 mx-auto max-w-[85vw] space-y-8"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* Main Input Section */}
//       <motion.div
//         className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl "
//         variants={itemVariants}
//         whileHover={{
//           scale: 1.01,
//           boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
//           borderColor: "rgba(63, 255, 173, 0.3)"
//         }}
//         transition={{ duration: 0.3 }}
//       >
//         <div className="flex flex-col lg:flex-row gap-6 items-end">
//           <motion.div
//             className="flex-grow"
//             variants={itemVariants}
//           >
//             <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
//               Stock Symbol
//             </label>
//             <motion.div className="relative">
//               <input
//                 type="text"
//                 placeholder="Enter stock symbol (e.g., AAPL, TSLA, NVDA)"
//                 value={inputStock}
//                 onChange={(e) => setInputStock(e.target.value)}
//                 onKeyUp={handleKeyPress}
//                 className="w-full bg-black/50 border-2 border-gray-600/50 rounded-2xl p-6 text-white text-lg placeholder-gray-400 focus:border-[#3fffad] focus:ring-4 focus:ring-[#3fffad]/20 transition-all duration-300 backdrop-blur-sm h-12"
//                 disabled={summaryLoading || reportLoading}
//               />
//               <motion.div
//                 className="absolute inset-0 rounded-2xl border-2 border-[#3fffad]/0 pointer-events-none"
//                 whileFocus={{ borderColor: "rgba(63, 255, 173, 0.5)" }}
//                 variants={glowVariants}
//                 animate={inputStock ? "glow" : ""}
//               />
//             </motion.div>
//           </motion.div>

//           <div className="flex gap-4 items-end">
//             <motion.button
//               onClick={handleGenerateSummary}
//               disabled={!inputStock || summaryLoading || reportLoading}
//               className="relative overflow-hidden bg-gradient-to-r from-blue-600/50 to-purple-600/40 hover:from-blue-500/40 hover:to-purple-500/40 disabled:from-blue-600/50 disabled:to-purple-600/40 backdrop-blur-md border border-blue-400/25 text-blue-300 hover:text-blue-200 disabled:text-blue-300/80 py-3 px-8 rounded-3xl font-semibold disabled:cursor-not-allowed transition-all duration-300 w-auto md:min-w-[180px] h-auto md:h-12 shadow-lg"
//               whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
//               whileTap={{ scale: 0.95 }}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.6 }}
//             >
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
//                 initial={{ x: "-100%" }}
//                 whileHover={{ x: "100%" }}
//                 transition={{ duration: 0.6 }}
//               />
//               <div className="relative z-10 flex items-center justify-center gap-2 font-normal">
//                 {summaryLoading ? (
//                   <>
//                     <motion.div
//                       className="w-5 h-5 border-2 border-white border-t-transparent rounded-full font-normal"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     />
//                     {pollingStatus || 'Analyzing...'}
//                   </>
//                 ) : (
//                   <>
//                     <span>🔍</span>
//                     Generate Analysis
//                   </>
//                 )}
//               </div>
//             </motion.button>

//             <motion.button
//               onClick={handleGenerateReportWithAuth}
//               disabled={!inputStock || summaryLoading || reportLoading}
//               className="relative overflow-hidden bg-gradient-to-r from-green-500/50 to-emerald-500/30 hover:from-emerald-400/40 hover:to-green-400/40 disabled:from-green-500/50 disabled:to-emerald-500/30 backdrop-blur-md border border-emerald-400/25 text-emerald-300 hover:text-emerald-200 disabled:text-emerald-300/80 py-3 px-8 rounded-3xl font-normal disabled:cursor-not-allowed transition-all duration-300 min-w-[180px] h-auto md:h-12 shadow-lg"
//               whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(63, 255, 173, 0.4)" }}
//               whileTap={{ scale: 0.95 }}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.8 }}
//             >
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent font-normal"
//                 initial={{ x: "-100%" }}
//                 whileHover={{ x: "100%" }}
//                 transition={{ duration: 0.6 }}
//               />
//               <div className="relative z-10 flex items-center justify-center gap-2">
//                 {reportLoading ? (
//                   <>
//                     <motion.div
//                       className="w-5 h-5 border-2 border-black border-t-transparent rounded-full font-normal"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     />
//                       {pollingStatus || 'Creating PDF...'}
//                   </>
//                 ) : (
//                   <>
//                     <span>📊</span>
//                     Generate Report
//                   </>
//                 )}
//               </div>
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Error Display */}
//       <AnimatePresence>
//         {(summaryError || pdfError) && (
//           <motion.div
//             className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-red-300"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-2xl">⚠️</span>
//               <span className="font-medium">{summaryError || pdfError}</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Analysis Results */}
//       <AnimatePresence>
//         {!summaryLoading && summaries.combined && showSummary && (
//             <motion.div 
//                 className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl border border-white/10"
//                 variants={itemVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//               >
//                 {/* Header with Close Button */}
//                 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//                   <motion.h3 
//                     className="text-2xl font-bold text-white flex items-center gap-3"
//                     variants={itemVariants}
//                   >
//                     <span>📊</span>
//                     Analysis Results for {inputStock.toUpperCase()}
//                   </motion.h3>
                  
//                   <motion.button
//                     onClick={handleCloseSummary}
//                     className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.3 }}
//                   >
//                     <span>✕</span>
//                   </motion.button>
//                 </div>
                
//                 {/* Tab Navigation */}
//                 <div className="mb-6">
//                   <nav className="flex flex-wrap justify-center gap-2 mb-6">
//                     {["combined", "annual", "concall", "forum"].map((tab) => (
//                       <motion.button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`${
//                           activeTab === tab
//                             ? "bg-[#3fffad] text-black border-[#3fffad]"
//                             : "bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-[#3fffad]/50"
//                         } px-6 py-3 rounded-2xl font-medium text-sm border-2 transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-center`}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         <span>{getTabIcon(tab)}</span>
//                         {getTabLabel(tab)}
//                       </motion.button>
//                     ))}
//                   </nav>
                  
//                   {/* Tab Content */}
//                   <AnimatePresence mode="wait">
//                     <motion.div 
//                       key={activeTab}
//                       className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
//                       variants={tabVariants}
//                       initial="hidden"
//                       animate="visible"
//                       exit="exit"
//                     >
//                       <div className="prose prose-invert max-w-none text-gray-100 leading-relaxed">
//                         <ReactMarkdown>
//                           {summaries[activeTab]}
//                         </ReactMarkdown>
//                       </div>
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//         )}
//       </AnimatePresence>

//       {/* PDF Preview Section */}
//       <AnimatePresence>
//         {showPdfPreview && pdfBlobUrl && (
//           <motion.div
//             className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl border border-white/10"
//             variants={itemVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//           >
//             {/* Header with Close Button */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//               <motion.h3 
//                 className="text-2xl font-bold text-white flex items-center gap-3"
//                 variants={itemVariants}
//               >
//                 <span>📊</span>
//                 PDF Report for {inputStock.toUpperCase()}
//               </motion.h3>
              
//               <motion.button
//                 onClick={() => setShowPdfPreview(false)}
//                 className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <span>✕</span>
//               </motion.button>
//             </div>
            
//             {/* PDF Viewer */}
//             <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <iframe
//                 src={pdfBlobUrl}
//                 className="w-full h-[600px] rounded-xl"
//                 title={`PDF Report for ${inputStock}`}
//                 style={{ border: 'none' }}
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Login Prompt remains unchanged */}
//       <AnimatePresence>
//         {showLoginPrompt && (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//                 onClick={() => setShowLoginPrompt(false)}
//               >
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full text-center"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
//                     className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
//                   >
//                     <span className="text-2xl">🔒</span>
//                   </motion.div>
//                   <h3 className="text-xl font-bold text-white mb-3">Login Required</h3>
//                   <p className="text-white/70 mb-6">You need to log in to generate PDF reports.</p>
//                   <div className="flex gap-3 justify-center">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
//                       onClick={() => {
//                         setShowLoginPrompt(false);
//                         setIsLoginOpen(true);
//                       }}
//                     >
//                       Log In
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
//                       onClick={() => setShowLoginPrompt(false)}
//                     >
//                       Cancel
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//         )}
//       </AnimatePresence>
//       <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
//     </motion.div>
//   );
// };

// StockSelector.propTypes = {
//   inputStock: PropTypes.string.isRequired,
//   setInputStock: PropTypes.func.isRequired,
//   summaries: PropTypes.object.isRequired,
//   setSummaries: PropTypes.func.isRequired,
//   summaryLoading: PropTypes.bool.isRequired,
//   setSummaryLoading: PropTypes.func.isRequired,
//   summaryError: PropTypes.string,
//   setSummaryError: PropTypes.func.isRequired,
//   reportLoading: PropTypes.bool.isRequired,
//   setReportLoading: PropTypes.func.isRequired,
//   pdfError: PropTypes.string,
//   setPdfError: PropTypes.func.isRequired,
//   showPdfPreview: PropTypes.bool.isRequired,
//   setShowPdfPreview: PropTypes.func.isRequired,
//   storagePath: PropTypes.string,
//   setStoragePath: PropTypes.func.isRequired,
// };

// export default StockSelector;