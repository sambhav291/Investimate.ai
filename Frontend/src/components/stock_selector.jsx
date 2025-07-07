import React, { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useFetchWithAuth } from "../utils/fetchWithAuth"; 
import { Document, Page} from "react-pdf";
import Login from './Login';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const StockSelector = ({
  inputStock,
  setInputStock,
  summaries,
  summaryLoading,
  summaryError,
  handleGenerateSummary,
  pdfUrl,
  setPdfUrl,
  reportLoading,
  pdfError,
  handleGenerateReport,
  showPdfPreview,
  setShowPdfPreview,
  storagePath,
  // setStoragePath,
}) => {
  console.log("Component mounted or props changed");
  const [activeTab, setActiveTab] = useState("combined");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const { token } = useContext(AuthContext);
  const fetchWithAuth = useFetchWithAuth(); 
  const lastFetchedPathRef = useRef("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show summary when summaries are available and not loading
  useEffect(() => {
    if (!summaryLoading && summaries.combined) {
      setShowSummary(true);
    }
  }, [summaryLoading, summaries.combined]);

  // Handle close summary
  const handleCloseSummary = () => {
    console.log("Closing summary analysis");
    setShowSummary(false);
  };

  useEffect(() => {
    let didCancel = false;

    const fetchPdf = async () => {
      if (!showPdfPreview || !storagePath) {
        console.log("Clearing PDF Blob URL");
        setPdfBlobUrl(null);
        lastFetchedPathRef.current = "";
        return;
      }

      // Avoid re-fetching if already fetched for same storage path
      if (lastFetchedPathRef.current === storagePath) {
        console.log("Already fetched for this path, skipping fetch.");
        return;
      }
      try {
        console.log("Fetching PDF preview for:", storagePath);
        const res = await fetchWithAuth(
          `http://localhost:8000/preview-pdf?storage_path=${encodeURIComponent(storagePath)}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch PDF. Status: ${res.status}`);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (!didCancel) {
          setPdfBlobUrl((prevUrl) => {
            if (prevUrl && prevUrl !== url) {
              URL.revokeObjectURL(prevUrl);
            }
            console.log("PDF Blob URL set:", url);
            return url;
          });
          lastFetchedPathRef.current = storagePath;
        }
      } catch (err) {
        if (!didCancel) {
          console.error("Error fetching PDF preview:", err);
        }
      }
    };
    fetchPdf();
    return () => {
      didCancel = true;
    };
  }, [showPdfPreview, storagePath, fetchWithAuth]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px rgba(63, 255, 173, 0.2)",
        "0 0 40px rgba(63, 255, 173, 0.3)",
        "0 0 20px rgba(63, 255, 173, 0.2)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const pdfPreviewVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 50,
      transition: { duration: 0.3 }
    }
  };

  const handleGenerateReportWithAuth = () => {
  if (!token) {
    console.warn("[AUTH] No token found. Showing login prompt.");
    setShowLoginPrompt(true);
    return;
  }
  handleGenerateReport();
  };

  const handleDownloadPdf = () => {
    console.log("Download PDF clicked for URL:", pdfUrl);
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", `${inputStock.trim()}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      console.log("Download triggered");
    }
  };

  const handleClosePdfPreview = () => {
    console.log("Closing PDF Preview");
    setShowPdfPreview(false);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfUrl(null);
      console.log("Revoked PDF Blob URL and cleared preview");
    }
    setSaveMessage("");
  };

  const handleSaveToLibrary = async () => {
    console.log("Saving report to library for:", inputStock);
    setSaveLoading(true);
    setSaveMessage("");

    try {      
      const filename = storagePath?.split("/").pop();

      if (!filename) {
        throw new Error("Filename not available — generate report first.");
      }

      const res = await fetchWithAuth("http://localhost:8000/save-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          stock_name: inputStock.trim(),
          filename: filename, 
        }),
      });

      console.log("Save report response:", res.status);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save report.");
      }

      setSaveMessage("Report saved to your library!");
      console.log("Report saved successfully");
    } catch (err) {
      console.error("Error saving report:", err.message);
      setSaveMessage(err.message);
    } finally {
      setSaveLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputStock.trim() && !summaryLoading && !reportLoading) {
      console.log("Enter key pressed. Generating summary for:", inputStock);
      handleGenerateSummary();
    }
  };

  const getTabIcon = (tab) => {
    const icons = {
      combined: "🔄",
      annual: "📊",
      concall: "🎧",
      forum: "💬"
    };
    return icons[tab] || "📄";
  };

  const getTabLabel = (tab) => {
    const labels = {
      combined: "Combined Summary",
      annual: "Annual Report",
      concall: "Concall Transcript",
      forum: "Investor Forum"
    };
    return labels[tab] || tab;
  };

  return (
    <motion.div 
      className="p-6 mx-auto max-w-[85vw] space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Input Section */}
      <motion.div 
        className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl "
        variants={itemVariants}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
          borderColor: "rgba(63, 255, 173, 0.3)"
        }}
        transition={{ duration: 0.3 }}
      >        
        <div className="flex flex-col lg:flex-row gap-6 items-end">
          <motion.div 
            className="flex-grow"
            variants={itemVariants}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Stock Symbol
            </label>
            <motion.div className="relative">
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL, TSLA, NVDA)"
                value={inputStock}
                onChange={(e) => setInputStock(e.target.value)}
                onKeyUp={handleKeyPress}
                className="w-full bg-black/50 border-2 border-gray-600/50 rounded-2xl p-6 text-white text-lg placeholder-gray-400 focus:border-[#3fffad] focus:ring-4 focus:ring-[#3fffad]/20 transition-all duration-300 backdrop-blur-sm h-12"
                disabled={summaryLoading || reportLoading}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-[#3fffad]/0 pointer-events-none"
                whileFocus={{ borderColor: "rgba(63, 255, 173, 0.5)" }}
                variants={glowVariants}
                animate={inputStock ? "glow" : ""}
              />
            </motion.div>
          </motion.div>
          
          <div className="flex gap-4 items-end">
            <motion.button
              onClick={handleGenerateSummary}
              disabled={!inputStock || summaryLoading || reportLoading}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-500 disabled:to-purple-500 text-white py-3 px-8 rounded-3xl font-semibold disabled:cursor-not-allowed transition-all duration-300 w-auto md:min-w-[180px] h-auto md:h-12 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10 flex items-center justify-center gap-2 font-normal">
                {summaryLoading ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full font-normal"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analyzing...
                  </>
                ) : (
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
              className="relative overflow-hidden bg-gradient-to-r from-[#3fffad] to-emerald-500 hover:from-[#2ee89c] hover:to-emerald-600 disabled:from-[#3fffad]/50 disabled:to-emerald-500/50 text-black py-3 px-8 rounded-3xl font-semibold disabled:cursor-not-allowed transition-all duration-300 min-w-[180px] h-auto md:h-12 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(63, 255, 173, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent font-normal"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10 flex items-center justify-center gap-2">
                {reportLoading ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full font-normal"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating PDF...
                  </>
                ) : (
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

      {/* Error Display */}
      <AnimatePresence>
        {summaryError && (
          <motion.div 
            className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-red-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{summaryError}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {!summaryLoading && summaries.combined && showSummary && (
          <motion.div 
            className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl border border-white/10"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header with Close Button */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <motion.h3 
                className="text-2xl font-bold text-white flex items-center gap-3"
                variants={itemVariants}
              >
                <span>📊</span>
                Analysis Results for {inputStock.toUpperCase()}
              </motion.h3>
              
              <motion.button
                onClick={handleCloseSummary}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span>✕</span>
              </motion.button>
            </div>
            
            {/* Tab Navigation */}
            <div className="mb-6">
              <nav className="flex flex-wrap justify-center gap-2 mb-6">
                {["combined", "annual", "concall", "forum"].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => {
                      console.log("Switched to tab:", tab);
                      setActiveTab(tab);
                    }}
                    className={`${
                      activeTab === tab
                        ? "bg-[#3fffad] text-black border-[#3fffad]"
                        : "bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-[#3fffad]/50"
                    } px-6 py-3 rounded-2xl font-medium text-sm border-2 transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-center`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{getTabIcon(tab)}</span>
                    {getTabLabel(tab)}
                  </motion.button>
                ))}
              </nav>
              
              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="text-gray-100 whitespace-pre-wrap leading-relaxed">
                    {summaries[activeTab]}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview */}
      <AnimatePresence>
        {showPdfPreview && pdfBlobUrl && (
          <motion.div 
            className="bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl border border-white/10"
            variants={pdfPreviewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <motion.h3 
                className="text-2xl font-bold text-white flex items-center gap-3"
                variants={itemVariants}
              >
                <span>📄</span>
                Report Preview - {inputStock.toUpperCase()}
              </motion.h3>
              
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  onClick={handleDownloadPdf}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>⬇️</span>
                  Download PDF
                </motion.button>
                
                <motion.button
                  onClick={handleSaveToLibrary}
                  disabled={saveLoading || !token}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-600/50 disabled:to-emerald-700/50 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {saveLoading ? (
                    <>
                      <motion.div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Save to Library
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={handleClosePdfPreview}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>✕</span>
                  Close
                </motion.button>
              </div>
            </div>
            
            {saveMessage && (
              <motion.div 
                className={`mb-4 p-4 rounded-2xl font-medium flex items-center gap-3 ${
                  saveMessage.includes('saved') 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span>{saveMessage.includes('saved') ? '✅' : '❌'}</span>
                {saveMessage}
              </motion.div>
            )}
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
              <div 
                className="bg-black/20 backdrop-blur-sm overflow-y-auto max-h-[80vh] p-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#3fffad #1f2937' }}
              >
                {console.log("PDF Blob URL being used:", pdfBlobUrl)}
                <Document
                  file={pdfBlobUrl}
                  onLoadSuccess={({ numPages }) => {
                    console.log(`PDF loaded with ${numPages} pages`);
                    setNumPages(numPages);
                  }}
                  onLoadError={(error) => console.error("Error loading PDF:", error)}
                  className="flex flex-col items-center"
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <motion.div
                      key={`page_${index + 1}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-6 last:mb-0"
                    >
                      <Page
                        pageNumber={index + 1}
                        width={Math.min(700, window.innerWidth * 0.7)}
                        className="shadow-lg rounded-lg overflow-hidden border border-white/20"
                      />
                    </motion.div>
                  ))}
                </Document>
              </div>
              
              <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/20 text-sm text-gray-300 text-center">
                <span className="flex items-center justify-center gap-2">
                  <span>💡</span>
                  Click "Download PDF" to save the complete report
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Error Display */}
      <AnimatePresence>
        {pdfError && (
          <motion.div 
            className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-red-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <h4 className="font-semibold mb-1">PDF Generation Error</h4>
                <p>{pdfError}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Prompt Popup */}
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
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl">🔒</span>
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">Login Required</h3>
              <p className="text-white/70 mb-6">You need to log in to generate PDF reports.</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  onClick={() => {
                    setShowLoginPrompt(false);
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
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
  summaries: PropTypes.shape({
    combined: PropTypes.string,
    annual: PropTypes.string,
    concall: PropTypes.string,
    forum: PropTypes.string,
  }).isRequired,
  summaryLoading: PropTypes.bool.isRequired,
  summaryError: PropTypes.string,
  handleGenerateSummary: PropTypes.func.isRequired,
  pdfUrl: PropTypes.string,
  setPdfUrl: PropTypes.func.isRequired,
  reportLoading: PropTypes.bool.isRequired,
  pdfError: PropTypes.string,
  handleGenerateReport: PropTypes.func.isRequired,
  showPdfPreview: PropTypes.bool.isRequired,
  setShowPdfPreview: PropTypes.func.isRequired,
  storagePath: PropTypes.string,
  setStoragePath: PropTypes.func.isRequired,
};

export default StockSelector;










// import React, { useState, useContext, useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import { motion, AnimatePresence } from "framer-motion";
// import { AuthContext } from "../context/AuthContext";
// import { useFetchWithAuth } from "../utils/fetchWithAuth"; 
// import { Document, Page} from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// const StockSelector = ({
//   inputStock,
//   setInputStock,
//   summaries,
//   summaryLoading,
//   summaryError,
//   handleGenerateSummary,
//   pdfUrl,
//   setPdfUrl,
//   reportLoading,
//   pdfError,
//   handleGenerateReport,
//   showPdfPreview,
//   setShowPdfPreview,
//   storagePath,
// }) => {
//   const [activeTab, setActiveTab] = useState("combined");
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [saveMessage, setSaveMessage] = useState("");
//   const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const { token } = useContext(AuthContext);
//   const fetchWithAuth = useFetchWithAuth(); 
//   const lastFetchedPathRef = useRef("");

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
//         const res = await fetchWithAuth(
//           `http://localhost:8000/preview-pdf?storage_path=${encodeURIComponent(storagePath)}`
//         );
//         if (!res.ok) throw new Error(`Failed to fetch PDF. Status: ${res.status}`);
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         if (!didCancel) {
//           setPdfBlobUrl((prevUrl) => {
//             if (prevUrl && prevUrl !== url) URL.revokeObjectURL(prevUrl);
//             return url;
//           });
//           lastFetchedPathRef.current = storagePath;
//         }
//       } catch (err) {
//         if (!didCancel) console.error("Error fetching PDF preview:", err);
//       }
//     };
//     fetchPdf();
//     return () => { didCancel = true; };
//   }, [showPdfPreview, storagePath, fetchWithAuth]);

//   const handleDownloadPdf = () => {
//     if (pdfUrl) {
//       const link = document.createElement("a");
//       link.href = pdfUrl;
//       link.setAttribute("download", `${inputStock.trim()}_report.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     }
//   };

//   const handleClosePdfPreview = () => {
//     setShowPdfPreview(false);
//     if (pdfBlobUrl) {
//       URL.revokeObjectURL(pdfBlobUrl);
//       setPdfUrl(null);
//     }
//     setSaveMessage("");
//   };

//   const handleSaveToLibrary = async () => {
//     setSaveLoading(true);
//     setSaveMessage("");
//     try {
//       const res = await fetchWithAuth("http://localhost:8000/save-report", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ stock_name: inputStock.trim() }),
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.detail || "Failed to save report.");
//       }
//       setSaveMessage("Report saved to your library!");
//     } catch (err) {
//       setSaveMessage(err.message);
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && inputStock.trim() && !summaryLoading && !reportLoading) {
//       handleGenerateSummary();
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   const buttonVariants = {
//     idle: { scale: 1, boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" },
//     hover: { 
//       scale: 1.05, 
//       boxShadow: "0 8px 25px rgba(59, 130, 246, 0.5)",
//       transition: { duration: 0.2 }
//     },
//     tap: { scale: 0.95 }
//   };

//   const pulseVariants = {
//     pulse: {
//       scale: [1, 1.05, 1],
//       opacity: [0.7, 1, 0.7],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };

//   const tabVariants = {
//     inactive: { 
//       backgroundColor: "rgba(31, 41, 55, 0.6)",
//       borderColor: "rgba(75, 85, 99, 0.5)",
//       color: "rgba(156, 163, 175, 1)",
//       scale: 1
//     },
//     active: { 
//       backgroundColor: "rgba(59, 130, 246, 0.2)",
//       borderColor: "rgba(59, 130, 246, 1)",
//       color: "rgba(59, 130, 246, 1)",
//       scale: 1.02,
//       transition: { duration: 0.3 }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
//       <motion.div 
//         className="max-w-6xl mx-auto"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Animated Background Elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <motion.div
//             className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
//             animate={{
//               x: [0, 100, 0],
//               y: [0, -100, 0],
//             }}
//             transition={{
//               duration: 20,
//               repeat: Infinity,
//               ease: "linear"
//             }}
//           />
//           <motion.div
//             className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
//             animate={{
//               x: [0, -100, 0],
//               y: [0, 100, 0],
//             }}
//             transition={{
//               duration: 25,
//               repeat: Infinity,
//               ease: "linear"
//             }}
//           />
//         </div>

//         {/* Header */}
//         <motion.div 
//           className="text-center mb-12"
//           variants={itemVariants}
//         >
//           <motion.h1 
//             className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent mb-4"
//             initial={{ opacity: 0, y: -30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             Financial Intelligence Hub
//           </motion.h1>
//           <motion.p 
//             className="text-gray-400 text-lg"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//           >
//             Advanced Stock Analysis & Brokerage Reports
//           </motion.p>
//         </motion.div>

//         {/* Main Control Panel */}
//         <motion.div 
//           className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8"
//           variants={itemVariants}
//           whileHover={{ 
//             boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
//             scale: 1.01
//           }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="flex flex-col lg:flex-row gap-6 items-end">
//             <motion.div 
//               className="flex-grow"
//               variants={itemVariants}
//             >
//               <label className="block text-sm font-semibold text-gray-300 mb-3">
//                 Company Symbol
//               </label>
//               <motion.input
//                 type="text"
//                 placeholder="Enter stock symbol (e.g., TCS, RELIANCE)"
//                 value={inputStock}
//                 onChange={(e) => setInputStock(e.target.value)}
//                 onKeyUp={handleKeyPress}
//                 className="w-full bg-gray-900/70 border-2 border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
//                 disabled={summaryLoading || reportLoading}
//                 whileFocus={{ 
//                   scale: 1.02,
//                   boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
//                 }}
//               />
//             </motion.div>
            
//             <div className="flex gap-4">
//               <motion.button
//                 onClick={handleGenerateSummary}
//                 disabled={!inputStock || summaryLoading || reportLoading}
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-xl font-semibold disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300"
//                 variants={buttonVariants}
//                 initial="idle"
//                 whileHover="hover"
//                 whileTap="tap"
//                 animate={summaryLoading ? "pulse" : "idle"}
//               >
//                 {summaryLoading ? (
//                   <div className="flex items-center gap-2">
//                     <motion.div 
//                       className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     />
//                     Analyzing...
//                   </div>
//                 ) : "Generate Analysis"}
//               </motion.button>
              
//               <motion.button
//                 onClick={handleGenerateReport}
//                 disabled={!inputStock || summaryLoading || reportLoading}
//                 className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 px-8 rounded-xl font-semibold disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300"
//                 variants={buttonVariants}
//                 initial="idle"
//                 whileHover="hover"
//                 whileTap="tap"
//                 animate={reportLoading ? "pulse" : "idle"}
//               >
//                 {reportLoading ? (
//                   <div className="flex items-center gap-2">
//                     <motion.div 
//                       className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     />
//                     Generating PDF...
//                   </div>
//                 ) : "Generate Report"}
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Error Messages */}
//         <AnimatePresence>
//           {summaryError && (
//             <motion.div 
//               className="bg-red-900/50 border-2 border-red-500 p-4 rounded-xl text-red-300 mb-6 backdrop-blur-sm"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 50 }}
//               transition={{ duration: 0.5 }}
//             >
//               {summaryError}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Analysis Results */}
//         <AnimatePresence>
//           {!summaryLoading && summaries.combined && (
//             <motion.div 
//               className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8"
//               initial={{ opacity: 0, y: 50, scale: 0.9 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -50, scale: 0.9 }}
//               transition={{ duration: 0.6 }}
//             >
//               {/* Tab Navigation */}
//               <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-900/50 rounded-xl">
//                 {["combined", "annual", "concall", "forum"].map((tab, index) => (
//                   <motion.button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className="px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2"
//                     variants={tabVariants}
//                     animate={activeTab === tab ? "active" : "inactive"}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     {tab === "combined" && "📊 Combined Summary"}
//                     {tab === "annual" && "📈 Annual Report"}
//                     {tab === "concall" && "🎤 Concall Transcript"}
//                     {tab === "forum" && "💬 Investor Forum"}
//                   </motion.button>
//                 ))}
//               </div>

//               {/* Tab Content */}
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   className="bg-gray-900/70 rounded-xl p-6 border border-gray-600/50"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.4 }}
//                 >
//                   <motion.pre 
//                     className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     {summaries[activeTab]}
//                   </motion.pre>
//                 </motion.div>
//               </AnimatePresence>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* PDF Preview */}
//         <AnimatePresence>
//           {showPdfPreview && pdfBlobUrl && (
//             <motion.div 
//               className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8"
//               initial={{ opacity: 0, scale: 0.8, y: 100 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.8, y: -100 }}
//               transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
//             >
//               {/* PDF Header */}
//               <div className="flex justify-between items-center mb-6">
//                 <motion.h3 
//                   className="text-2xl font-bold text-white"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   📄 Report Preview - {inputStock}
//                 </motion.h3>
//                 <div className="flex gap-3">
//                   <motion.button
//                     onClick={handleDownloadPdf}
//                     className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium"
//                     whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)" }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     ⬇️ Download PDF
//                   </motion.button>
//                   <motion.button
//                     onClick={handleSaveToLibrary}
//                     disabled={saveLoading || !token}
//                     className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-medium disabled:from-gray-600 disabled:to-gray-700"
//                     whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)" }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     {saveLoading ? "💾 Saving..." : "💾 Save to Library"}
//                   </motion.button>
//                   <motion.button
//                     onClick={handleClosePdfPreview}
//                     className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-medium"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     ❌ Close
//                   </motion.button>
//                 </div>
//               </div>

//               {/* Save Message */}
//               <AnimatePresence>
//                 {saveMessage && (
//                   <motion.div 
//                     className="mb-4 p-3 bg-emerald-900/50 border border-emerald-500 rounded-lg text-emerald-300"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                   >
//                     {saveMessage}
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* PDF Viewer */}
//               <motion.div 
//                 className="bg-white rounded-xl overflow-hidden shadow-2xl h-[800px] overflow-y-auto"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.3 }}
//                 whileHover={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
//               >
//                 <Document
//                   file={pdfBlobUrl}
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   onLoadError={(error) => console.error("Error loading PDF:", error)}
//                 >
//                   {Array.from(new Array(numPages), (el, index) => (
//                     <motion.div
//                       key={`page_${index + 1}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <Page
//                         pageNumber={index + 1}
//                         width={600}
//                         className="mb-4 border-b border-gray-200"
//                       />
//                     </motion.div>
//                   ))}
//                 </Document>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* PDF Error */}
//         <AnimatePresence>
//           {pdfError && (
//             <motion.div 
//               className="bg-red-900/50 border-2 border-red-500 p-4 rounded-xl text-red-300 backdrop-blur-sm"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 50 }}
//               transition={{ duration: 0.5 }}
//             >
//               {pdfError}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Footer */}
//         <motion.div 
//           className="text-center mt-12 text-gray-500 text-sm"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//         >
//           <p>Powered by Advanced AI Financial Analysis • Real-time Market Data</p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// StockSelector.propTypes = {
//   inputStock: PropTypes.string.isRequired,
//   setInputStock: PropTypes.func.isRequired,
//   summaries: PropTypes.shape({
//     combined: PropTypes.string,
//     annual: PropTypes.string,
//     concall: PropTypes.string,
//     forum: PropTypes.string,
//   }).isRequired,
//   summaryLoading: PropTypes.bool.isRequired,
//   summaryError: PropTypes.string,
//   handleGenerateSummary: PropTypes.func.isRequired,
//   pdfUrl: PropTypes.string,
//   setPdfUrl: PropTypes.func.isRequired,
//   reportLoading: PropTypes.bool.isRequired,
//   pdfError: PropTypes.string,
//   handleGenerateReport: PropTypes.func.isRequired,
//   showPdfPreview: PropTypes.bool.isRequired,
//   setShowPdfPreview: PropTypes.func.isRequired,
//   storagePath: PropTypes.string,
//   setStoragePath: PropTypes.func.isRequired,
// };

// export default StockSelector;



