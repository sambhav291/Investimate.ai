import React, { useContext, useEffect, useState, useRef } from 'react';
import StockSelector from "./stock_selector";
import { AuthContext } from '../context/AuthContext';
import { useScroll } from "../context/ScrollContext";
import { useFetchWithAuth } from "../utils/fetchWithAuth";
import { motion } from "framer-motion";

const Services = () => {
  const { setToken } = useContext(AuthContext);
  const fetchWithAuth = useFetchWithAuth();

  console.log("Services: Initial render");

  // LIFTED STATE
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
  const { refs } = useScroll();

  //ANIMATORS 

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

  // HANDLERS
  const handleGenerateSummary = async () => {
    const trimmedStock = inputStock.trim();
    console.log("handleGenerateSummary called with:", trimmedStock);

    if (!trimmedStock) {
      console.warn("No company name entered for summary generation.");
      setSummaryError("Please enter a company name");
      return;
    }

    setSummaryLoading(true);
    setSummaries({ forum: "", annual: "", concall: "", combined: "" });
    setSummaryError("");

    try {
      console.log("Sending request to /generate-summary API...");
      const response = await fetchWithAuth("http://localhost:8000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_name: trimmedStock }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error("Stock not found.");
          throw new Error("Stock not found. Try a valid company name.");
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong.");
      }

      const data = await response.json();
      console.log("Received summary data:", data);

      setSummaries({
        forum: data.forum_summary || "No forum data available",
        annual: data.annual_report_summary || "No annual report data available",
        concall: data.concall_summary || "No concall data available",
        combined: data.combined_summary || "No combined summary available",
      });
    } catch (err) {
      console.error("Error generating summary:", err.message);
      setSummaryError(err.message);
    } finally {
      setSummaryLoading(false);
      console.log("Summary generation complete.");
    }
  };

  const handleGenerateReport = async () => {
    const trimmedStock = inputStock.trim();
    console.log("handleGenerateReport called with:", trimmedStock);

    if (!trimmedStock) {
      console.warn("No company name entered for report generation.");
      setPdfError("Please enter a company name");
      return;
    }

    setReportLoading(true);
    setPdfError("");
    setPdfUrl("");
    setShowPdfPreview(false);
    setStoragePath("");

    try {
      console.log("Sending request to /generate-report API...");
      const response = await fetchWithAuth("http://localhost:8000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_name: trimmedStock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Report generation failed:", errorData);
        throw new Error(errorData.detail || "Something went wrong.");
      }

      const data = await response.json();
      console.log("Received report data:", data);

      setPdfUrl(data.signed_url);
      setStoragePath(data.storage_path);
      setShowPdfPreview(true);
    } catch (err) {
      console.error("Error generating report:", err.message);
      setPdfError(err.message);
    } finally {
      setReportLoading(false);
      console.log("Report generation complete.");
    }
  };

  // Token extraction and storage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urltoken = params.get("token");

    if (urltoken) {
      console.log("Token found in URL, setting token...");
      setToken(urltoken);
      localStorage.setItem("token", urltoken);
      window.history.replaceState({}, document.title, "/");
    } else {
      console.log("No token found in URL.");
    }
  }, [setToken]);

  return (
    <>
    {/* <div className='flex justify-center min-h-screen pt-32 bg-black'>   */}
    <div className="min-h-screen relative overflow-hidden pt-32">
     
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />

      <div className="absolute inset-0 bg-black -z-10">
        {/* Light orbs */}
        <motion.div
          className="absolute top-[150px] left-[80px] w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-[150px] right-[80px] w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      
      <div className="w-full min-h-screen z-10 p-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block"
            variants={floatingVariants}
            animate="float"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-[#3fffad] drop-shadow-lg">
                Stock Analysis
              </span>
            </h1>
          </motion.div>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Generate comprehensive market insights and brokerage-quality reports 
            powered by advanced AI algorithms
          </motion.p>
        </motion.div>

        <div ref={refs.stockRef}>
          <StockSelector
            inputStock={inputStock}
            setInputStock={(val) => {
              console.log("Stock input changed to:", val);
              setInputStock(val);
            }}
            summaries={summaries}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
            handleGenerateSummary={handleGenerateSummary}
            pdfUrl={pdfUrl}
            setPdfUrl={(url) => {
              console.log("PDF URL updated to:", url);
              setPdfUrl(url);
            }}
            reportLoading={reportLoading}
            pdfError={pdfError}
            handleGenerateReport={handleGenerateReport}
            showPdfPreview={showPdfPreview}
            setShowPdfPreview={(val) => {
              console.log("Show PDF Preview set to:", val);
              setShowPdfPreview(val);
            }}
            storagePath={storagePath}
            setStoragePath={(path) => {
              console.log("Storage path updated to:", path);
              setStoragePath(path);
            }}
          />
        </div>


      </div>
    </div>
    </>
  );
};

export default Services;








// import React, { useContext, useEffect, useState } from 'react';
// import StockSelector from "./stock_selector";
// import Library from "./Library";
// import { Routes, Route } from "react-router-dom";
// import { AuthContext } from '../context/AuthContext';
// import { useFetchWithAuth } from "../utils/fetchWithAuth";

// const Services = () => {
//   const { setToken } = useContext(AuthContext);
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
//       const response = await fetchWithAuth("http://localhost:8000/generate-summary", {
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

//     try {
//       console.log("Sending request to /generate-report API...");
//       const response = await fetchWithAuth("http://localhost:8000/generate-report", {
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
//     <div className='bg-blue-100 flex justify-center min-h-screen'>
//       <div className="w-full max-w-5xl min-h-screen bg-gray-50 p-8">
//         <h1 className="text-center text-3xl font-bold py-6 text-zinc-950">Stock Forum Summary</h1>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <StockSelector
//                 inputStock={inputStock}
//                 setInputStock={(val) => {
//                   console.log("Stock input changed to:", val);
//                   setInputStock(val);
//                 }}
//                 summaries={summaries}
//                 summaryLoading={summaryLoading}
//                 summaryError={summaryError}
//                 handleGenerateSummary={handleGenerateSummary}
//                 pdfUrl={pdfUrl}
//                 setPdfUrl={(url) => {
//                   console.log("PDF URL updated to:", url);
//                   setPdfUrl(url);
//                 }}
//                 reportLoading={reportLoading}
//                 pdfError={pdfError}
//                 handleGenerateReport={handleGenerateReport}
//                 showPdfPreview={showPdfPreview}
//                 setShowPdfPreview={(val) => {
//                   console.log("Show PDF Preview set to:", val);
//                   setShowPdfPreview(val);
//                 }}
//                 storagePath={storagePath}
//                 setStoragePath={(path) => {
//                   console.log("Storage path updated to:", path);
//                   setStoragePath(path);
//                 }}
//               />
//             }
//           />
//           <Route path="/library" element={<Library />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default Services;