import React, { useContext, useEffect, useState } from 'react';
import StockSelector from "./stock_selector.jsx";
import { AuthContext } from '../context/AuthContext.jsx';
import { useScroll } from "../context/ScrollContext.jsx";
import { useFetchWithAuth } from "../utils/fetchWithAuth.jsx";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { API_ENDPOINTS } from '../utils/apiConfig.js';

const Services = () => {
  const { login, token, setShowLoginModal } = useContext(AuthContext);
  const fetchWithAuth = useFetchWithAuth();
  const [inputStock, setInputStock] = useState("");
  const [summaries, setSummaries] = useState({
    forum: "",
    annual: "",
    concall: "",
    combined: "",
  });
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [summaryJobId, setSummaryJobId] = useState(null); 
  const [reportJobId, setReportJobId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [storagePath, setStoragePath] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const { refs } = useScroll();


  const fetchAndDisplayPdf = async (signedUrl) => {
    setReportLoading(true);
    setPdfError("");
    try {
      const response = await fetch(signedUrl); 
      if (!response.ok) {
        throw new Error(`Failed to download PDF: Server responded with ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfUrl(blobUrl); 
      setShowPdfPreview(true);
    } catch (err) {
      setPdfError(err.message || "Could not load the PDF file for preview.");
      setShowPdfPreview(false); 
    } finally {
      setReportLoading(false); 
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!summaryJobId || !summaryLoading) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await fetchWithAuth(`${API_ENDPOINTS.jobStatus}/${summaryJobId}`);
        if (!response.ok) {
          throw new Error("Failed to get summary status.");
        }

        const result = await response.json();

        if (result.status === "completed") {
          clearInterval(intervalId); 
          setSummaries({
            forum: result.data.forum_summary || "No forum data available",
            annual: result.data.annual_report_summary || "No annual report data available",
            concall: result.data.concall_summary || "No concall data available",
            combined: result.data.combined_summary || "No combined summary available",
          });
          setSummaryLoading(false);
          setSummaryJobId(null);
          } else if (result.status === "failed") {
            clearInterval(intervalId);
            console.error("Summary Job Failed - Backend Error:", result.data?.error); 
            setSummaryError("Analysis failed due to high server demand. Please try again shortly."); 
            setSummaryLoading(false);
            setSummaryJobId(null);
          }

      } catch (err) {
        clearInterval(intervalId); 
        setSummaryError(err.message);
        setSummaryLoading(false);
        setSummaryJobId(null);
      }
    }, 5000); 

    return () => clearInterval(intervalId);

  }, [summaryJobId, summaryLoading, fetchWithAuth]);


useEffect(() => {
  if (!reportJobId || !reportLoading) {
    return;
  }

  const intervalId = setInterval(async () => {
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.jobStatus}/${reportJobId}`);
      if (!response.ok) throw new Error("Failed to get report status.");

      const result = await response.json();

      if (result.status === "completed") {
        clearInterval(intervalId);
        setReportJobId(null);
        // --- The change is here ---
        if (result.data && result.data.signed_url) {
          setStoragePath(result.data.filename);
          fetchAndDisplayPdf(result.data.signed_url);
        } else {
          throw new Error("Report generation completed, but the PDF URL was not provided.");
        }
        } else if (result.status === "failed") {
          clearInterval(intervalId);
          console.error("Report Job Failed - Backend Error:", result.data?.error); 
          setPdfError("PDF generation failed due to high server load. Please try again after some time."); 
          setReportLoading(false);
          setReportJobId(null);
        }
    } catch (err) {
      clearInterval(intervalId);
      setPdfError(err.message);
      setReportLoading(false);
      setReportJobId(null);
    }
  }, 5000);

  return () => clearInterval(intervalId);
}, [reportJobId, reportLoading, fetchWithAuth]);

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleGenerateSummary = async () => {
    if (!token) {
      setShowLoginModal(true); // Show login prompt if user is not logged in
      return; // Stop the function from proceeding
    }

    const trimmedStock = inputStock.trim();
    if (!trimmedStock) {
      setSummaryError("Please enter a company name");
      return;
    }
    // Reset state and start loading
    setSummaryLoading(true);
    setSummaries({ forum: "", annual: "", concall: "", combined: "" });
    setSummaryError("");
    setSummaryJobId(null);

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.generateSummary, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: trimmedStock }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to start summary generation.");
      }

      const data = await response.json();
      if (data.job_id) {
        setSummaryJobId(data.job_id); // Save the job ID to trigger the polling
      } else {
        throw new Error("Backend did not return a job ID.");
      }
    } catch (err) {
      setSummaryError(err.message);
      setSummaryLoading(false); // Stop loading on initial failure
    }
  };

  const handleGenerateReport = async () => {
    const trimmedStock = inputStock.trim();
    if (!trimmedStock) {
      setPdfError("Please enter a company name");
      return;
    }
    // Reset state and start loading
    setReportLoading(true);
    setPdfError("");
    setPdfUrl("");
    setShowPdfPreview(false);
    setReportJobId(null);

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.generateReport, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: trimmedStock }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to start report generation.");
      }

      const data = await response.json();
      if (data.job_id) {
        setReportJobId(data.job_id); // Save the job ID to trigger polling
      } else {
        throw new Error("Backend did not return a report job ID.");
      }
    } catch (err) {
      setPdfError(err.message);
      setReportLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", `${inputStock.trim()}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleClosePdfPreview = () => {
    setShowPdfPreview(false);
    if (pdfUrl) {
      // URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
    setPdfUrl("");
    setStoragePath("");
    // setLastFetchedPath("");
    setNumPages(null);
    setSaveMessage("");
  };

  const handleSaveToLibrary = async () => {
    setSaveLoading(true);
    setSaveMessage("");
    try {      
      const filename = storagePath?.split("/").pop();
      if (!filename) {
        throw new Error("Filename not available — generate report first.");
      }
      const res = await fetchWithAuth(API_ENDPOINTS.saveReport, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stock_name: inputStock.trim(),
          filename: filename, 
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save report.");
      }
      setSaveMessage("Report saved to your library!");
    } catch (err) {
      setSaveMessage(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlRefreshToken = params.get("refresh_token");

    if (urlToken && urlRefreshToken) {
      login(urlToken, urlRefreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login]);

  return (
    <div className="min-h-screen relative overflow-hidden pt-32">
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

        <div ref={refs.stockRef}>
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
            setReportLoading={setReportLoading}
            setPdfError={setPdfError}
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
                {summaryLoading ? "Hang in there – good things take (a little) time." : "Hold tight! Your report is being cooked to perfection. This might take few minutes..."}
              </span>
            </div>
          )}
          {!reportLoading && showPdfPreview && storagePath && (
            <div className="mt-8 w-full flex flex-col items-center">
              <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                  <motion.h3 className="text-2xl font-bold text-white flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <span>📄</span>
                    Report Preview - {inputStock.toUpperCase()}
                  </motion.h3>
                  <div className="flex gap-3 flex-wrap">
                    <motion.button onClick={handleDownloadPdf} disabled={!pdfUrl} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                      <span>⬇️</span>
                      Download PDF
                    </motion.button>
                    <motion.button onClick={handleSaveToLibrary} disabled={saveLoading || !pdfUrl || !token} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-600/50 disabled:to-emerald-700/50 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                      {saveLoading ? ( <> <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} /> Saving... </> ) : ( <> <span>💾</span> Save to Library </> )}
                    </motion.button>
                    <motion.button onClick={handleClosePdfPreview} className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                      <span>✕</span>
                      Close
                    </motion.button>
                  </div>
                </div>
                {saveMessage && (
                  <motion.div className={`mb-4 p-4 rounded-2xl font-medium flex items-center gap-3 ${ saveMessage.includes('saved') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30' }`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <span>{saveMessage.includes('saved') ? '✅' : '❌'}</span>
                    {saveMessage}
                  </motion.div>
                )}
                {pdfUrl && !reportLoading ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <div className="bg-black/20 backdrop-blur-sm overflow-y-auto max-h-[80vh] p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3fffad #1f2937' }}>
                      <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)} onLoadError={() => setPdfError("Failed to load PDF")} className="flex flex-col items-center" loading={<div className="flex items-center justify-center p-8 text-blue-400"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div>}>
                        {Array.from(new Array(numPages), (el, index) => (
                          <motion.div key={`page_${index + 1}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="mb-6 last:mb-0">
                            <Page pageNumber={index + 1} width={Math.min(800, window.innerWidth * 0.8)} className="shadow-lg rounded-lg overflow-hidden border border-white/20" />
                          </motion.div>
                        ))}
                      </Document>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/20 text-sm text-gray-300 text-center">
                      <span className="flex items-center justify-center gap-2"><span>💡</span>Professional PDF Report Generated with AI</span>
                    </div>
                  </div>
                ) : pdfError ? (
                  <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-red-300">
                    <div className="flex items-center gap-3"><span className="text-2xl">⚠️</span><div><h4 className="font-semibold mb-1">PDF Generation Error</h4><p>{pdfError}</p></div></div>
                  </div>
                ) : (
                  <div className="rounded-2xl shadow-lg flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/20 p-8">
                    <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3fffad] border-t-transparent mx-auto mb-4"></div><p className="text-gray-300 text-lg">Loading PDF preview...</p></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Services.propTypes = {};

export default Services;





















