import React from 'react';
import PropTypes from 'prop-types';
import StockSelector from "./stock_selector.jsx";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Download, Archive, X } from 'lucide-react';

const Services = (props) => {
  const {
    inputStock, setInputStock,
    summaries, setSummaries,
    summaryLoading, summaryError,
    reportLoading, pdfError,
    showPdfPreview, setShowPdfPreview,
    storagePath,
    handleGenerateSummary, handleGenerateReport,
    pdfUrl, setPdfUrl, numPages, setNumPages,
    handleDownloadPdf, handleSaveToLibrary,
    saveLoading, saveMessage
  } = props;

  const handleClosePdfPreview = () => {
    setShowPdfPreview(false);
    if (pdfUrl && pdfUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(""); // Clear the blob URL
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const floatingVariants = {
    float: {
      y: [0, -5, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-32">
       {/* Background and decorative elements remain the same... */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="absolute inset-0 bg-black -z-10">
        <motion.div
          className="absolute top-[150px] left-[80px] w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[150px] right-[80px] w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="w-full min-h-screen z-10 p-8">
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div className="inline-block" variants={floatingVariants} animate="float">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">AI-Powered</span>
              <br />
              <span className="text-[#3fffad] drop-shadow-lg">Stock Analysis</span>
            </h1>
          </motion.div>
          <motion.p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Generate comprehensive market insights and brokerage-quality reports powered by advanced AI algorithms
          </motion.p>
        </motion.div>

        <div>
          <StockSelector
            inputStock={inputStock}
            setInputStock={setInputStock}
            summaries={summaries}
            setSummaries={setSummaries}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
            handleGenerateSummary={handleGenerateSummary}
            reportLoading={reportLoading}
            pdfError={pdfError}
            handleGenerateReport={handleGenerateReport}
          />
          {(summaryLoading || reportLoading) && (
            <div className="flex flex-col items-center justify-center mt-2">
              <DotLottieReact
                src="https://lottie.host/ef02f5d9-0ba8-48b4-9541-195edcbc2d92/p0CX9M6GUg.lottie"
                loop
                autoplay
                speed={1.5}
                className="w-[300px] h-[300px]"
              />
              <span className="mt-2 text-gray-100 text-base font-medium animate-pulse select-none">
                {summaryLoading ? "Hang in there – good things take (a little) time." : "Hold tight! Your report is being cooked to perfection..."}
              </span>
            </div>
          )}
          {!reportLoading && showPdfPreview && pdfUrl && (
            <div className="mt-8 w-full flex flex-col items-center">
              <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                  <motion.h3 className="text-2xl font-bold text-white flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <span>📄</span>
                    Report Preview - {inputStock.toUpperCase()}
                  </motion.h3>
<div className="flex gap-4">
                    {/* Download Button */}
                    <div className="relative group">
                      <motion.button 
                        onClick={handleDownloadPdf} 
                        disabled={!pdfUrl} 
                        className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm disabled:opacity-50"
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Download
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black/80"></div>
                      </div>
                    </div>

                    {/* Save to Library Button */}
                    <div className="relative group">
                      <motion.button 
                        onClick={handleSaveToLibrary} 
                        disabled={saveLoading || !pdfUrl} 
                        className="p-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all duration-300 border border-green-500/20 backdrop-blur-sm disabled:opacity-50"
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        {saveLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Archive className="w-5 h-5" />}
                      </motion.button>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Save to Library
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black/80"></div>
                      </div>
                    </div>
                    
                    {/* Close Button */}
                    <div className="relative group">
                      <motion.button 
                        onClick={handleClosePdfPreview} 
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300 border border-red-500/20 backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Close
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black/80"></div>
                      </div>
                    </div>
                  </div>
                </div>
                 {saveMessage && (
                  <motion.div className={`mb-4 p-4 rounded-2xl font-medium ${ saveMessage.includes('saved') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300' }`}>
                    {saveMessage}
                  </motion.div>
                )}
                <div className="bg-black/20 rounded-2xl overflow-hidden">
                  <div className="overflow-y-auto max-h-[80vh] p-4">
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      error={<div className="text-red-300 p-4">Failed to render the PDF document. It may be corrupted.</div>}
                      loading={<div className="text-white/70 p-4 text-center">Loading PDF preview...</div>}
                      className="flex flex-col items-center gap-4"
                    >
                      {Array.from(new Array(numPages || 0), (el, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={Math.min(800, window.innerWidth * 0.8)}
                          className="shadow-lg"
                        />
                      ))}
                    </Document>
                  </div>
                </div>
              </div>
            </div>
          )}
          {pdfError && (
            <div className="mt-4 max-w-4xl mx-auto bg-red-500/10 p-4 rounded-2xl text-red-300 text-center border border-red-500/30">
              {pdfError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for the props received from App.jsx
Services.propTypes = {
  inputStock: PropTypes.string.isRequired,
  setInputStock: PropTypes.func.isRequired,
  summaries: PropTypes.object.isRequired,
  setSummaries: PropTypes.func.isRequired,
  summaryLoading: PropTypes.bool.isRequired,
  summaryError: PropTypes.string.isRequired,
  reportLoading: PropTypes.bool.isRequired,
  pdfError: PropTypes.string.isRequired,
  showPdfPreview: PropTypes.bool.isRequired,
  setShowPdfPreview: PropTypes.func.isRequired,
  storagePath: PropTypes.string.isRequired,
  handleGenerateSummary: PropTypes.func.isRequired,
  handleGenerateReport: PropTypes.func.isRequired,
  pdfUrl: PropTypes.string.isRequired,
  setPdfUrl: PropTypes.func.isRequired,
  numPages: PropTypes.number,
  setNumPages: PropTypes.func.isRequired,
  handleDownloadPdf: PropTypes.func.isRequired,
  handleSaveToLibrary: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  saveMessage: PropTypes.string.isRequired,
};

export default Services;





























