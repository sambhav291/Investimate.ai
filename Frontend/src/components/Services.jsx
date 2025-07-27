import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
  // All of your original state and logic are preserved here.
  // This component correctly acts as the "brain" for this section of the page.
  const { setToken, token } = useContext(AuthContext);
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
  const [pdfUrl, setPdfUrl] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [storagePath, setStoragePath] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [pdfBlobLoading, setPdfBlobLoading] = useState(false);
  const [lastFetchedPath, setLastFetchedPath] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const { refs } = useScroll();

  // All of your original handler functions and useEffects are preserved.
  useEffect(() => {
    if (showPdfPreview && storagePath && storagePath !== lastFetchedPath) {
      setPdfError("");
      setPdfBlobLoading(true);
      setNumPages(null);
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl("");
      }
      
      const fetchPdfBlob = async () => {
        try {
          const response = await fetchWithAuth(
            `${API_ENDPOINTS.previewPdf}?storage_path=${encodeURIComponent(storagePath)}`
          );
          
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status}`);
          }
          
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(blobUrl);
          setLastFetchedPath(storagePath);
        } catch (error) {
          setPdfError("Failed to load PDF preview");
        } finally {
          setPdfBlobLoading(false);
        }
      };
      
      fetchPdfBlob();
    } else if (!showPdfPreview) {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl("");
      }
      setPdfBlobLoading(false);
      setLastFetchedPath("");
      setNumPages(null);
    }
  }, [showPdfPreview, storagePath, fetchWithAuth, pdfBlobUrl, lastFetchedPath]);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

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
    const trimmedStock = inputStock.trim();
    if (!trimmedStock) {
      setSummaryError("Please enter a company name");
      return;
    }
    setSummaryLoading(true);
    setSummaries({ forum: "", annual: "", concall: "", combined: "" });
    setSummaryError("");
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.generateSummary, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_name: trimmedStock }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Stock not found. Try a valid company name.");
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong.");
      }
      const data = await response.json();
      setSummaries({
        forum: data.forum_summary || "No forum data available",
        annual: data.annual_report_summary || "No annual report data available",
        concall: data.concall_summary || "No concall data available",
        combined: data.combined_summary || "No combined summary available",
      });
    } catch (err) {
      setSummaryError(err.message);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    const trimmedStock = inputStock.trim();
    if (!trimmedStock) {
      setPdfError("Please enter a company name");
      return;
    }
    setReportLoading(true);
    setPdfError("");
    setPdfUrl("");
    setShowPdfPreview(false);
    setStoragePath("");
    setLastFetchedPath("");
    setNumPages(null);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl("");
    }
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.generateReport, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_name: trimmedStock }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong.");
      }
      const data = await response.json();
      setPdfUrl(data.signed_url);
      setStoragePath(data.storage_path);
      setShowPdfPreview(true);
    } catch (err) {
      setPdfError(err.message);
    } finally {
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
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl("");
    }
    setPdfUrl("");
    setStoragePath("");
    setLastFetchedPath("");
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
    const urltoken = params.get("token");
    if (urltoken) {
      setToken(urltoken);
      localStorage.setItem("token", urltoken);
      window.history.replaceState({}, document.title, "/");
    }
  }, [setToken]);

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
          {/* --- THE ONLY CHANGE IS HERE: Pass all necessary props down --- */}
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
                    <motion.button onClick={handleDownloadPdf} disabled={!pdfBlobUrl} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                      <span>⬇️</span>
                      Download PDF
                    </motion.button>
                    <motion.button onClick={handleSaveToLibrary} disabled={saveLoading || !pdfBlobUrl || !token} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-600/50 disabled:to-emerald-700/50 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
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
                {pdfBlobUrl && !pdfBlobLoading ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <div className="bg-black/20 backdrop-blur-sm overflow-y-auto max-h-[80vh] p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3fffad #1f2937' }}>
                      <Document file={pdfBlobUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)} onLoadError={() => setPdfError("Failed to load PDF")} className="flex flex-col items-center" loading={<div className="flex items-center justify-center p-8 text-blue-400"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div>}>
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
    </>
  );
};

// It's good practice to define the prop types for the component.
Services.propTypes = {};

export default Services;






















// import React, { useContext, useEffect, useState } from 'react';
// import StockSelector from "./stock_selector";
// import { AuthContext } from '../context/AuthContext';
// import { useScroll } from "../context/ScrollContext";
// import { useFetchWithAuth } from "../utils/fetchWithAuth";
// import { motion } from "framer-motion";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import { Document, Page } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";
// import { API_ENDPOINTS } from '../utils/apiConfig';

// const Services = () => {
//   const { setToken, token } = useContext(AuthContext);
//   const fetchWithAuth = useFetchWithAuth();

//   console.log("Services: Initial render");

//   // LIFTED STATE
//   const [inputStock, setInputStock] = useState("");
//   const [summaries, setSummaries] = useState({
//     forum: "",
//     annual: "",
//     concall: "",
//     combined: "",
//   });
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   const [summaryError, setSummaryError] = useState("");
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [reportLoading, setReportLoading] = useState(false);
//   const [pdfError, setPdfError] = useState("");
//   const [showPdfPreview, setShowPdfPreview] = useState(false);
//   const [storagePath, setStoragePath] = useState("");
//   const [pdfBlobUrl, setPdfBlobUrl] = useState("");
//   const [pdfBlobLoading, setPdfBlobLoading] = useState(false);
//   const [lastFetchedPath, setLastFetchedPath] = useState("");
//   const [numPages, setNumPages] = useState(null);
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [saveMessage, setSaveMessage] = useState("");
//   const { refs } = useScroll();

//   // Fetch PDF as blob when storagePath changes
//   useEffect(() => {
//     if (showPdfPreview && storagePath && storagePath !== lastFetchedPath) {
//       // Clear previous state
//       setPdfError("");
//       setPdfBlobLoading(true);
//       setNumPages(null);
//       if (pdfBlobUrl) {
//         URL.revokeObjectURL(pdfBlobUrl);
//         setPdfBlobUrl("");
//       }
      
//       const fetchPdfBlob = async () => {
//         try {
//           console.log("Fetching PDF blob for storage path:", storagePath);
//           const response = await fetchWithAuth(
//             `${API_ENDPOINTS.previewPdf}?storage_path=${encodeURIComponent(storagePath)}`
//           );
          
//           if (!response.ok) {
//             throw new Error(`Failed to fetch PDF: ${response.status}`);
//           }
          
//           const blob = await response.blob();
//           const blobUrl = URL.createObjectURL(blob);
//           setPdfBlobUrl(blobUrl);
//           setLastFetchedPath(storagePath);
//           console.log("PDF blob URL created:", blobUrl);
//         } catch (error) {
//           console.error("Error fetching PDF blob:", error);
//           setPdfError("Failed to load PDF preview");
//         } finally {
//           setPdfBlobLoading(false);
//         }
//       };
      
//       fetchPdfBlob();
//     } else if (!showPdfPreview) {
//       // Clear blob URL when not showing preview
//       if (pdfBlobUrl) {
//         URL.revokeObjectURL(pdfBlobUrl);
//         setPdfBlobUrl("");
//       }
//       setPdfBlobLoading(false);
//       setLastFetchedPath("");
//       setNumPages(null);
//     }
//   }, [showPdfPreview, storagePath]); // Removed dependencies that cause infinite loops

//   // Cleanup blob URL when component unmounts
//   useEffect(() => {
//     return () => {
//       if (pdfBlobUrl) {
//         URL.revokeObjectURL(pdfBlobUrl);
//       }
//     };
//   }, [pdfBlobUrl]);

//   //ANIMATORS 

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: { duration: 0.6, ease: "easeOut" }
//     }
//   };

  
//   const floatingVariants = {
//     float: {
//       y: [0, -5, 0],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };

//   // HANDLERS
//   const handleGenerateSummary = async () => {
//     const trimmedStock = inputStock.trim();
//     console.log("handleGenerateSummary called with:", trimmedStock);

//     if (!trimmedStock) {
//       console.warn("No company name entered for summary generation.");
//       setSummaryError("Please enter a company name");
//       return;
//     }

//     setSummaryLoading(true);
//     setSummaries({ forum: "", annual: "", concall: "", combined: "" });
//     setSummaryError("");

//     try {
//       console.log("Sending request to /generate-summary API...");
//       const response = await fetchWithAuth(API_ENDPOINTS.generateSummary, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ stock_name: trimmedStock }),
//       });

//       if (!response.ok) {
//         if (response.status === 404) {
//           console.error("Stock not found.");
//           throw new Error("Stock not found. Try a valid company name.");
//         }
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Something went wrong.");
//       }

//       const data = await response.json();
//       console.log("Received summary data:", data);

//       setSummaries({
//         forum: data.forum_summary || "No forum data available",
//         annual: data.annual_report_summary || "No annual report data available",
//         concall: data.concall_summary || "No concall data available",
//         combined: data.combined_summary || "No combined summary available",
//       });
//     } catch (err) {
//       console.error("Error generating summary:", err.message);
//       setSummaryError(err.message);
//     } finally {
//       setSummaryLoading(false);
//       console.log("Summary generation complete.");
//     }
//   };

//   const handleGenerateReport = async () => {
//     const trimmedStock = inputStock.trim();
//     console.log("handleGenerateReport called with:", trimmedStock);

//     if (!trimmedStock) {
//       console.warn("No company name entered for report generation.");
//       setPdfError("Please enter a company name");
//       return;
//     }

//     setReportLoading(true);
//     setPdfError("");
//     setPdfUrl("");
//     setShowPdfPreview(false);
//     setStoragePath("");
//     setLastFetchedPath("");
//     setNumPages(null);
//     // Clear previous PDF blob URL
//     if (pdfBlobUrl) {
//       URL.revokeObjectURL(pdfBlobUrl);
//       setPdfBlobUrl("");
//     }

//     try {
//       console.log("Sending request to /generate-report API...");
//       const response = await fetchWithAuth(API_ENDPOINTS.generateReport, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ stock_name: trimmedStock }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Report generation failed:", errorData);
//         throw new Error(errorData.detail || "Something went wrong.");
//       }

//       const data = await response.json();
//       console.log("Received report data:", data);

//       setPdfUrl(data.signed_url);
//       setStoragePath(data.storage_path);
//       setShowPdfPreview(true);
//     } catch (err) {
//       console.error("Error generating report:", err.message);
//       setPdfError(err.message);
//     } finally {
//       setReportLoading(false);
//       console.log("Report generation complete.");
//     }
//   };

//   const handleDownloadPdf = () => {
//     console.log("Download PDF clicked for URL:", pdfUrl);
//     if (pdfUrl) {
//       const link = document.createElement("a");
//       link.href = pdfUrl;
//       link.setAttribute("download", `${inputStock.trim()}_report.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       console.log("Download triggered");
//     }
//   };

//   const handleClosePdfPreview = () => {
//     console.log("Closing PDF Preview");
//     setShowPdfPreview(false);
//     if (pdfBlobUrl) {
//       URL.revokeObjectURL(pdfBlobUrl);
//       setPdfBlobUrl("");
//     }
//     setPdfUrl("");
//     setStoragePath("");
//     setLastFetchedPath("");
//     setNumPages(null);
//     setSaveMessage("");
//     console.log("PDF Preview closed and cleaned up");
//   };

//   const handleSaveToLibrary = async () => {
//     console.log("Saving report to library for:", inputStock);
//     setSaveLoading(true);
//     setSaveMessage("");

//     try {      
//       const filename = storagePath?.split("/").pop();

//       if (!filename) {
//         throw new Error("Filename not available — generate report first.");
//       }

//       const res = await fetchWithAuth(API_ENDPOINTS.saveReport, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           stock_name: inputStock.trim(),
//           filename: filename, 
//         }),
//       });

//       console.log("Save report response:", res.status);

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.detail || "Failed to save report.");
//       }

//       setSaveMessage("Report saved to your library!");
//       console.log("Report saved successfully");
//     } catch (err) {
//       console.error("Error saving report:", err.message);
//       setSaveMessage(err.message);
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   // Token extraction and storage
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const urltoken = params.get("token");

//     if (urltoken) {
//       console.log("Token found in URL, setting token...");
//       setToken(urltoken);
//       localStorage.setItem("token", urltoken);
//       window.history.replaceState({}, document.title, "/");
//     } else {
//       console.log("No token found in URL.");
//     }
//   }, [setToken]);

//   return (
//     <>
//     <div className="min-h-screen relative overflow-hidden pt-32">
//       <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />

//       <div className="absolute inset-0 bg-black -z-10">
//         {/* Light orbs */}
//         <motion.div
//           className="absolute top-[150px] left-[80px] w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
//           animate={{
//             x: [0, 100, 0],
//             y: [0, -50, 0],
//             scale: [1, 1.2, 1],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
//         <motion.div
//           className="absolute bottom-[150px] right-[80px] w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
//           animate={{
//             x: [0, -100, 0],
//             y: [0, 50, 0],
//             scale: [1.2, 1, 1.2],
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />

//         {/* Grid Lines */}
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
//       </div>
      
//       <div className="w-full min-h-screen z-10 p-8">
//         {/* Header Section */}
//         <motion.div 
//           className="text-center mb-16"
//           variants={itemVariants}
//         >
//           <motion.div
//             className="inline-block"
//             variants={floatingVariants}
//             animate="float"
//           >
//             <h1 className="text-6xl md:text-7xl font-bold mb-6">
//               <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
//                 AI-Powered
//               </span>
//               <br />
//               <span className="text-[#3fffad] drop-shadow-lg">
//                 Stock Analysis
//               </span>
//             </h1>
//           </motion.div>
//           <motion.p 
//             className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8 }}
//           >
//             Generate comprehensive market insights and brokerage-quality reports 
//             powered by advanced AI algorithms
//           </motion.p>
//         </motion.div>

//         <div ref={refs.stockRef}>
//           <StockSelector
//             inputStock={inputStock}
//             setInputStock={(val) => {
//               console.log("Stock input changed to:", val);
//               setInputStock(val);
//             }}
//             summaries={summaries}
//             summaryLoading={summaryLoading}
//             summaryError={summaryError}
//             handleGenerateSummary={handleGenerateSummary}
//             pdfUrl={pdfUrl}
//             setPdfUrl={(url) => {
//               console.log("PDF URL updated to:", url);
//               setPdfUrl(url);
//             }}
//             reportLoading={reportLoading}
//             pdfError={pdfError}
//             handleGenerateReport={handleGenerateReport}
//             showPdfPreview={showPdfPreview}
//             setShowPdfPreview={(val) => {
//               console.log("Show PDF Preview set to:", val);
//               setShowPdfPreview(val);
//             }}
//             storagePath={storagePath}
//             setStoragePath={(path) => {
//               console.log("Storage path updated to:", path);
//               setStoragePath(path);
//             }}
//           />
//           {/* Lottie Loading Animation below StockSelector for both summary and report generation */}
//           {(summaryLoading || reportLoading) && (
//             <div className="flex flex-col items-center justify-center mt-2">
//               <DotLottieReact
//                 src="https://lottie.host/ef02f5d9-0ba8-48b4-9541-195edcbc2d92/p0CX9M6GUg.lottie"
//                 loop
//                 autoplay
//                 speed={1.5}
//                 rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
//                 className="w-[300px] h-[300px]"
//               />
//               <span className="mt-2 text-gray-100 text-base font-medium animate-pulse select-none">
//                 {summaryLoading ? "Hang in there – good things take (a little) time." : "Hold tight! Your report is being cooked to perfection. This might take few minutes..."}
//               </span>
//             </div>
//           )}
//           {/* Show report preview below animation when loading is done */}
//           {!reportLoading && showPdfPreview && storagePath && (
//             <div className="mt-8 w-full flex flex-col items-center">
//               <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-3xl p-8 shadow-2xl border border-white/10">
//                 {/* Header with buttons */}
//                 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//                   <motion.h3 
//                     className="text-2xl font-bold text-white flex items-center gap-3"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <span>📄</span>
//                     Report Preview - {inputStock.toUpperCase()}
//                   </motion.h3>
                  
//                   <div className="flex gap-3 flex-wrap">
//                     <motion.button
//                       onClick={handleDownloadPdf}
//                       disabled={!pdfBlobUrl}
//                       className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.3 }}
//                     >
//                       <span>⬇️</span>
//                       Download PDF
//                     </motion.button>
                    
//                     <motion.button
//                       onClick={handleSaveToLibrary}
//                       disabled={saveLoading || !pdfBlobUrl || !token}
//                       className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-600/50 disabled:to-emerald-700/50 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.4 }}
//                     >
//                       {saveLoading ? (
//                         <>
//                           <motion.div 
//                             className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
//                             animate={{ rotate: 360 }}
//                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                           />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <span>💾</span>
//                           Save to Library
//                         </>
//                       )}
//                     </motion.button>
                    
//                     <motion.button
//                       onClick={handleClosePdfPreview}
//                       className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.5 }}
//                     >
//                       <span>✕</span>
//                       Close
//                     </motion.button>
//                   </div>
//                 </div>
                
//                 {/* Save message */}
//                 {saveMessage && (
//                   <motion.div 
//                     className={`mb-4 p-4 rounded-2xl font-medium flex items-center gap-3 ${
//                       saveMessage.includes('saved') 
//                         ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
//                         : 'bg-red-500/20 text-red-300 border border-red-500/30'
//                     }`}
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <span>{saveMessage.includes('saved') ? '✅' : '❌'}</span>
//                     {saveMessage}
//                   </motion.div>
//                 )}

//                 {/* PDF Content */}
//                 {pdfBlobUrl && !pdfBlobLoading ? (
//                   <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
//                     <div 
//                       className="bg-black/20 backdrop-blur-sm overflow-y-auto max-h-[80vh] p-4"
//                       style={{ scrollbarWidth: 'thin', scrollbarColor: '#3fffad #1f2937' }}
//                     >
//                       <Document
//                         file={pdfBlobUrl}
//                         onLoadSuccess={({ numPages }) => {
//                           console.log(`PDF loaded with ${numPages} pages`);
//                           setNumPages(numPages);
//                         }}
//                         onLoadError={(error) => {
//                           console.error("Error loading PDF:", error);
//                           setPdfError("Failed to load PDF");
//                         }}
//                         className="flex flex-col items-center"
//                         loading={
//                           <div className="flex items-center justify-center p-8 text-blue-400">
//                             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//                           </div>
//                         }
//                       >
//                         {Array.from(new Array(numPages), (el, index) => (
//                           <motion.div
//                             key={`page_${index + 1}`}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="mb-6 last:mb-0"
//                           >
//                             <Page
//                               pageNumber={index + 1}
//                               width={Math.min(800, window.innerWidth * 0.8)}
//                               className="shadow-lg rounded-lg overflow-hidden border border-white/20"
//                             />
//                           </motion.div>
//                         ))}
//                       </Document>
//                     </div>
                    
//                     <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/20 text-sm text-gray-300 text-center">
//                       <span className="flex items-center justify-center gap-2">
//                         <span>💡</span>
//                         Professional PDF Report Generated with AI
//                       </span>
//                     </div>
//                   </div>
//                 ) : pdfError ? (
//                   <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-red-300">
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl">⚠️</span>
//                       <div>
//                         <h4 className="font-semibold mb-1">PDF Generation Error</h4>
//                         <p>{pdfError}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="rounded-2xl shadow-lg flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/20 p-8">
//                     <div className="text-center">
//                       <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3fffad] border-t-transparent mx-auto mb-4"></div>
//                       <p className="text-gray-300 text-lg">Loading PDF preview...</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <span className="mt-4 text-gray-400 text-sm">Interactive PDF Preview</span>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//     </>
//   );
// };

// export default Services;

