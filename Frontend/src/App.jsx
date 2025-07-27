// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import AboutUs from './components/AboutUs';
// import Services from './components/Services';
// import Library from './components/Library';
// import Footer from './components/Footer';
// import { useScroll } from './context/ScrollContext';
// import { motion } from 'framer-motion';

// const App = () => {
//   const { refs } = useScroll();
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [authError, setAuthError] = useState(null);

//   // useLocation hook is used to get the current URL details.
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//       const progress = docHeight > 0 ? scrollTop / docHeight : 0;
//       setScrollProgress(progress);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const error = urlParams.get('error');
//     const message = urlParams.get('message');
    
//     if (error) {
//       let errorMessage = 'Login failed. Please try again.';
//       if (error === 'oauth_failed') {
//         errorMessage = `Google login failed: ${message || 'An unknown error occurred.'}`;
//       }
      
//       setAuthError(errorMessage);
//       window.history.replaceState({}, document.title, location.pathname);

//       const timer = setTimeout(() => setAuthError(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [location]); 
//   return (
//     <>
//       <Navbar />
//       {authError && (
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -50 }}
//           style={{
//             position: 'fixed',
//             top: '80px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             zIndex: 100,
//             backgroundColor: '#fee2e2',
//             border: '1px solid #fecaca',
//             borderRadius: '8px',
//             padding: '12px 20px',
//             color: '#dc2626',
//             fontSize: '14px',
//             fontWeight: '500',
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//             maxWidth: '400px',
//             textAlign: 'center'
//           }}
//         >
//           {authError}
//           <button
//             onClick={() => setAuthError(null)}
//             style={{
//               marginLeft: '10px',
//               color: '#dc2626',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               border: 'none',
//               background: 'none'
//             }}
//           >
//             ×
//           </button>
//         </motion.div>
//       )}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: scrollProgress > 0.01 ? 1 : 0 }}
//         style={{
//           width: `${Math.min(scrollProgress * 100, 100)}%`,
//           height: '5px',
//           position: 'fixed',
//           top: '64px',
//           left: 0,
//           zIndex: 50,
//           background: 'linear-gradient(90deg, #3fffad 0%, #38bdf8 100%)',
//           borderRadius: '0 8px 8px 0',
//           boxShadow: '0 2px 8px rgba(56,189,248,0.15)',
//           transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1)'
//         }}
//       />
//       <div className="scroll-smooth">
//         <section ref={refs.homeRef}>
//           <Home />
//         </section>

//         <section ref={refs.stockRef}>
//           <Services />
//         </section>

//         <section ref={refs.libraryRef}>
//           <Library />
//         </section>

//         <section ref={refs.aboutRef}>
//           <AboutUs />
//         </section>
        
//         <section>
//           <Footer/>
//         </section>
        
//       </div>
//     </>
//   );
// };

// export default App;










import React, { useEffect, useState, useCallback } from 'react';
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

const App = () => {
  const { refs } = useScroll();
  const location = useLocation();
  const fetchWithAuth = useFetchWithAuth();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [authError, setAuthError] = useState(null);

  const [inputStock, setInputStock] = useState("");
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [storagePath, setStoragePath] = useState("");
  const [summaryJobId, setSummaryJobId] = useState(null);
  const [reportJobId, setReportJobId] = useState(null);
  const [pollingStatus, setPollingStatus] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error === 'oauth_failed') {
        errorMessage = `Google login failed: ${message || 'An unknown error occurred.'}`;
      }
      
      setAuthError(errorMessage);
      window.history.replaceState({}, document.title, location.pathname);

      const timer = setTimeout(() => setAuthError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const pollJobStatus = useCallback(async (jobId, statusUrl, onComplete, onError) => {
    try {
      const res = await fetchWithAuth(`${statusUrl}/${jobId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();

      if (result.status === 'completed') {
        onComplete(result.data);
        return true;
      } else if (result.status === 'failed') {
        throw new Error(result.error || 'Job failed on the server.');
      } else {
        setPollingStatus(`Processing... Status: ${result.status || 'running'}`);
        return false;
      }
    } catch (err) {
      onError(err.message);
      return true;
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (!summaryJobId) return;
    const intervalId = setInterval(async () => {
      const isFinished = await pollJobStatus(
        summaryJobId,
        API_ENDPOINTS.summaryStatus,
        (data) => {
          setSummaries(data);
          setSummaryLoading(false); // <-- Loading stops ONLY on completion
          setPollingStatus('');
          setSummaryJobId(null);
        },
        (errorMsg) => {
          setSummaryError(errorMsg);
          setSummaryLoading(false); // <-- Loading stops ONLY on error
          setPollingStatus('');
          setSummaryJobId(null);
        }
      );
      if (isFinished) clearInterval(intervalId);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [summaryJobId, pollJobStatus]);

  useEffect(() => {
    if (!reportJobId) return;
    const intervalId = setInterval(async () => {
      const isFinished = await pollJobStatus(
        reportJobId,
        API_ENDPOINTS.reportStatus,
        (data) => {
          setShowPdfPreview(true);
          setStoragePath(data.storage_path);
          setReportLoading(false); // <-- Loading stops ONLY on completion
          setPollingStatus('');
          setReportJobId(null);
        },
        (errorMsg) => {
          setPdfError(errorMsg);
          setReportLoading(false); // <-- Loading stops ONLY on error
          setPollingStatus('');
          setReportJobId(null);
        }
      );
      if (isFinished) clearInterval(intervalId);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [reportJobId, pollJobStatus]);

  // --- CHANGE IS HERE ---
  const handleGenerateSummary = async () => {
    if (!inputStock) {
      setSummaryError('Please enter a stock name.');
      return;
    }
    setSummaryLoading(true); // <-- Loading starts
    setSummaryError('');
    setSummaries({});
    setShowPdfPreview(false);
    setPollingStatus('Starting summary generation...');

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.generateSummary, {
        method: 'POST',
        body: JSON.stringify({ stock_name: inputStock }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to start summary generation.');
      }
      const { job_id } = await res.json();
      setSummaryJobId(job_id); // This triggers the polling useEffect
      setPollingStatus('Summary generation is in progress. Please wait...');
    } catch (err) {
      setSummaryError(err.message);
      setSummaryLoading(false); // Set loading to false only if the initial call fails
      setPollingStatus('');
    }
    // REMOVED: `finally { setSummaryLoading(false) }` - This was the cause of the problem.
  };

  const handleGenerateReport = async () => {
    if (!inputStock) {
      setPdfError('Please enter a stock name to generate a report.');
      return;
    }
    setReportLoading(true); // <-- Loading starts
    setPdfError('');
    setShowPdfPreview(false);
    setPollingStatus('Starting report generation...');

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.generateReport, {
        method: 'POST',
        body: JSON.stringify({ stock_name: inputStock }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to start report generation.');
      }
      const { job_id } = await res.json();
      setReportJobId(job_id); // This triggers the polling useEffect
      setPollingStatus('Report generation is in progress. This may take several minutes...');
    } catch (err) {
      setPdfError(err.message);
      setReportLoading(false); // Set loading to false only if the initial call fails
      setPollingStatus('');
    }
    // REMOVED: `finally { setReportLoading(false) }`
  };

  return (
    <>
      <Navbar />
      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-100 border border-red-200 rounded-lg py-3 px-5 text-red-700 text-sm font-medium shadow-lg max-w-md text-center"
        >
          {authError}
          <button
            onClick={() => setAuthError(null)}
            className="ml-3 font-bold cursor-pointer border-none bg-transparent text-red-700"
          >
            ×
          </button>
        </motion.div>
      )}
      <motion.div
        className="fixed top-16 left-0 h-[5px] z-50 bg-gradient-to-r from-[#3fffad] to-[#38bdf8] rounded-r-lg shadow-lg"
        style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
      />
      <div className="scroll-smooth">
        <section ref={refs.homeRef}>
          <Home />
        </section>

        <section ref={refs.stockRef}>
          <Services
            inputStock={inputStock}
            setInputStock={setInputStock}
            summaries={summaries}
            setSummaries={setSummaries}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
            reportLoading={reportLoading}
            pdfError={pdfError}
            showPdfPreview={showPdfPreview}
            setShowPdfPreview={setShowPdfPreview}
            storagePath={storagePath}
            pollingStatus={pollingStatus}
            handleGenerateSummary={handleGenerateSummary}
            handleGenerateReport={handleGenerateReport}
          />
        </section>

        <section ref={refs.libraryRef}>
          <Library />
        </section>

        <section ref={refs.aboutRef}>
          <AboutUs />
        </section>
        
        <section>
          <Footer/>
        </section>
        
      </div>
    </>
  );
};

export default App;



