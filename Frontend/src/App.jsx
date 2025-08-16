import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Library from './components/Library';
import Footer from './components/Footer';
import { useScroll } from './context/ScrollContext';
import { motion } from 'framer-motion';
import { useFetchWithAuth } from './utils/fetchWithAuth.jsx';
import { API_ENDPOINTS } from './utils/apiConfig.js';
import { AuthContext } from './context/AuthContext.jsx';


const App = () => {
  const { refs } = useScroll();
  const location = useLocation();
  const fetchWithAuth = useFetchWithAuth();
  const { token, setShowLoginModal } = useContext(AuthContext);

  // All state now lives in App.jsx
  const [inputStock, setInputStock] = useState("");
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [summaryJobId, setSummaryJobId] = useState(null);

  const [reportLoading, setReportLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [storagePath, setStoragePath] = useState("");
  const [reportJobId, setReportJobId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Polling logic remains in App.jsx
  const pollJobStatus = useCallback(async (jobId, onComplete, onError) => {
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.jobStatus}/${jobId}`);
      if (!response.ok) throw new Error("Failed to get job status.");
      
      const result = await response.json();
      if (result.status === 'completed') {
        onComplete(result.data);
        return true; // Job finished
      } else if (result.status === 'failed') {
        throw new Error(result.data?.error || 'Job failed on the server.');
      }
      return false; // Job still running
    } catch (err) {
      onError(err.message);
      return true; // Stop polling on error
    }
  }, [fetchWithAuth]);

  // Effect for polling summary job
  useEffect(() => {
    if (!summaryJobId) return;
    const intervalId = setInterval(async () => {
      const isFinished = await pollJobStatus(
        summaryJobId,
        (data) => {
          setSummaries({
            forum: data.forum_summary || "No forum data available",
            annual: data.annual_report_summary || "No annual report data available",
            concall: data.concall_summary || "No concall data available",
            combined: data.combined_summary || "No combined summary available",
          });
          setSummaryLoading(false);
          setSummaryJobId(null);
        },
        (errorMsg) => {
          setSummaryError("Analysis failed. This could be due to high server demand. Please try again shortly.");
          setSummaryLoading(false);
          setSummaryJobId(null);
        }
      );
      if (isFinished) clearInterval(intervalId);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [summaryJobId, pollJobStatus]);

  // Effect for polling report job
  useEffect(() => {
    if (!reportJobId) return;

    const fetchAndDisplayPdf = async (signedUrl) => {
      try {
        const response = await fetch(signedUrl);
        if (!response.ok) {
          throw new Error(`PDF download failed: Server responded with status ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfUrl(blobUrl);
        setShowPdfPreview(true);
      } catch (err) {
        console.error("Error processing PDF after download:", err);
        setPdfError("Failed to process the downloaded PDF. See browser console for details.");
        setShowPdfPreview(false);
      } finally {
        setReportLoading(false);
      }
    };

    const intervalId = setInterval(async () => {
      const isFinished = await pollJobStatus(
        reportJobId,
        (data) => {
          if (data && data.signed_url) {
            setStoragePath(data.filename);
            fetchAndDisplayPdf(data.signed_url);
          } else {
            setPdfError("Report generation completed, but the signed URL was missing.");
            setReportLoading(false);
          }
          setReportJobId(null);
        },
        (errorMsg) => {
          setPdfError(`PDF generation failed. This may be due to high server load or an issue with the requested stock. Please try again later.`);
          setReportLoading(false);
          setReportJobId(null);
        }
      );
      if (isFinished) clearInterval(intervalId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [reportJobId, pollJobStatus]);

  // API call handlers
  const handleGenerateSummary = async () => {
    if (!token) { setShowLoginModal(true); return; }
    const trimmedStock = inputStock.trim();
    if (!trimmedStock) { setSummaryError("Please enter a company name"); return; }
    
    setSummaryLoading(true);
    setSummaries({});
    setSummaryError("");
    
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.generateSummary, {
        method: "POST",
        body: JSON.stringify({ company: trimmedStock }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to start summary generation.");
      }
      const data = await response.json();
      setSummaryJobId(data.job_id);
    } catch (err) {
      setSummaryError(err.message);
      setSummaryLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!token) { setShowLoginModal(true); return; }
    const trimmedStock = inputStock.trim();
    if (!trimmedStock) { setPdfError("Please enter a company name"); return; }

    setReportLoading(true);
    setPdfError("");
    setPdfUrl("");
    setShowPdfPreview(false);

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.generateReport, {
        method: "POST",
        body: JSON.stringify({ company: trimmedStock }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to start report generation.");
      }
      const data = await response.json();
      setReportJobId(data.job_id);
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

  const handleSaveToLibrary = async () => {
    if (!storagePath) {
      setSaveMessage("Cannot save report: filename is missing.");
      return;
    }
    setSaveLoading(true);
    setSaveMessage("");
    try {
      const filename = storagePath.split("/").pop();

      const response = await fetchWithAuth(API_ENDPOINTS.saveReport, {
        method: "POST",
        body: JSON.stringify({
          stock_name: inputStock.trim(), 
          filename: filename,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.detail || `Failed to save. Server responded with ${response.status}`);
      }

      const result = await response.json();
      setSaveMessage(result.message || "Report saved to your library!");

    } catch (err) {
      setSaveMessage(err.message);
    } finally {
      setSaveLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      {/* Scroll progress and other UI elements remain the same */}
      <div className="scroll-smooth">
        <section ref={refs.homeRef}><Home /></section>
        
        <section ref={refs.stockRef}>
          <Services
            inputStock={inputStock} setInputStock={setInputStock}
            summaries={summaries} setSummaries={setSummaries}
            summaryLoading={summaryLoading} summaryError={summaryError}
            reportLoading={reportLoading} pdfError={pdfError}
            showPdfPreview={showPdfPreview} setShowPdfPreview={setShowPdfPreview}
            storagePath={storagePath}
            handleGenerateSummary={handleGenerateSummary}
            handleGenerateReport={handleGenerateReport}
            pdfUrl={pdfUrl} setPdfUrl={setPdfUrl}
            numPages={numPages} setNumPages={setNumPages}
            handleDownloadPdf={handleDownloadPdf}
            handleSaveToLibrary={handleSaveToLibrary}
            saveLoading={saveLoading}
            saveMessage={saveMessage}
          />
        </section>

        <section ref={refs.libraryRef}><Library /></section>
        <section ref={refs.aboutRef}><AboutUs /></section>
        <section><Footer /></section>
      </div>
    </>
  );
};

export default App;










