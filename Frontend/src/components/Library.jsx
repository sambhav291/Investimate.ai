
import React, { useEffect, useState, useContext } from "react";
import { Document, Page} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AuthContext } from "../context/AuthContext";
import { FileText, Download, Trash2, Eye, Clock, FolderOpen, Search, Filter, Star, Calendar, BarChart3, TrendingUp, Zap, Grid3X3, List, X, Plus, Archive } from "lucide-react";
import { useFetchWithAuth } from "../utils/fetchWithAuth";
import { motion, AnimatePresence } from "framer-motion";
import Login from './Login';
import { API_ENDPOINTS } from '../utils/apiConfig';

const Library = () => {
  const { token, authStatus } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReport, setActiveReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const fetchWithAuth = useFetchWithAuth();
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [storagePath, setStoragePath] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Fetch all reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_ENDPOINTS.myReports, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
             console.error("Library: Initial fetch failed with 401. AuthContext will handle this.");
             return; 
          }
          throw new Error("Failed to fetch reports.");
        }
        const data = await res.json();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authStatus === 'authenticated' && token) {
      fetchReports();
    } else if (authStatus === 'unauthenticated') {
      setLoading(false);
      setReports([]);
      setFilteredReports([]);
    }
  }, [token, authStatus]); 

  // Filter + sort reports
  useEffect(() => {
    console.log("[FILTER] Search:", searchTerm, "| Sort:", sortBy);
    let filtered = reports.filter(report =>
      report.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.filename.localeCompare(b.filename));
    }

    console.log("[FILTER] Filtered results:", filtered);
    setFilteredReports(filtered);
  }, [reports, searchTerm, sortBy]);

  // Load PDF blob preview
  useEffect(() => {
    let blobUrl = null;

    const fetchPreview = async () => {
      if (!storagePath) {
        setPdfBlobUrl(null);
        return;
      }

      try {
        const res = await fetchWithAuth(`${API_ENDPOINTS.previewPdf}?storage_path=${encodeURIComponent(storagePath)}`);
        if (!res.ok) throw new Error("Failed to fetch PDF preview");
        
        const blob = await res.blob();
        blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);

      } catch (err) {
        console.error("[PDF PREVIEW] Error:", err.message);
        setError("Could not load the report preview.");
      }
    };
    fetchPreview();
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [storagePath, fetchWithAuth]); 

  const handleOpenReport = async (reportId) => {
    console.log("[OPEN REPORT] Opening report with ID:", reportId);
    try {
      const res = await fetchWithAuth(`${API_ENDPOINTS.myReports}/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to fetch PDF");
      }
      const data = await res.json();
      console.log("[OPEN REPORT] Received data:", data);
      setStoragePath(data.filepath);
      console.log("[OPEN REPORT] Supabase path received:", data.filepath);
      setActiveReport(reportId);
    } catch (err) {
      console.error("[OPEN REPORT] Error:", err.message);
      setError(err.message);
    }
  };

  const handleDeleteReport = async (reportId) => {
    console.log("[DELETE REPORT] Attempting to delete:", reportId);
    if (!window.confirm("Are you sure you want to delete this report?")) {
      console.log("[DELETE REPORT] User cancelled delete");
      return;
    }

    try {
      const res = await fetchWithAuth(`${API_ENDPOINTS.deleteReport}/${reportId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        console.log("[DELETE REPORT] Deleted successfully");
        setReports(reports.filter((r) => r.id !== reportId));
        if (activeReport === reportId) {
          console.log("[DELETE REPORT] Active report deleted, closing preview");
          setActiveReport(null);
        }
      } else {
        console.error("[DELETE REPORT] Server responded with failure");
        setError("Failed to delete report.");
      }
    } catch (err) {
      console.error("[DELETE REPORT] Error:", err.message);
      setError(err.message);
    }
  };

  const handleClosePdf = () => {
    console.log("[CLOSE PDF] Closing PDF preview");
    setStoragePath("");
    setActiveReport(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    console.log("[FILE SIZE] Computed:", size);
    return size;
  };

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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  if (!token || authStatus === 'unauthenticated') {
    console.warn("[AUTH] No token found. Showing restricted message.");
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1.3, 1, 1.3],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Archive className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">Access Your Library</h3>
            <p className="text-white/70 mb-6">Log in to view your research reports and analysis documents.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              onClick={() => {
                setIsLoginOpen(true);
              }}
            >
              Log In to Continue
            </motion.button>
          </motion.div>
        </div>
        <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    );
  }

  console.log("[RENDER] UI rendering with", filteredReports.length, "filtered reports");

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pt-16 px-16">
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
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-3xl"
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

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center"
              >
                <Archive className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Research Library</h1>
                <p className="text-white/60">Your comprehensive collection of financial analysis reports</p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="hidden lg:flex gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md  rounded-2xl p-3 text-center"
              >
                <div className="text-2xl font-bold text-green-400">{reports.length}</div>
                <div className="text-white/60 text-sm">Total Reports</div>
              </motion.div>
 
            </div>
          </div>

          {/* Control Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/5 backdrop-blur-md  rounded-3xl p-5"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search your research reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-2xl text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all backdrop-blur-sm h-auto md:h-12"
                />
              </div>
              
              {/* Controls */}
              <div className="flex gap-3 items-center ">
                {/* Sort Dropdown */}
                <div className="relative">
                  <Filter className="w-5 h-5 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/15 rounded-2xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all appearance-none backdrop-blur-sm w-auto md:min-w-[160px] h-auto md:h-12"
                  >
                    <option value="newest" className="bg-gray-800">Newest First</option>
                    <option value="oldest" className="bg-gray-800">Oldest First</option>
                    <option value="name" className="bg-gray-800">By Name</option>
                  </select>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/15 h-auto md:h-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-xl transition-all ${
                      viewMode === "grid" 
                        ? "bg-blue-500 text-white shadow-lg" 
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Grid3X3 className="w-auto md:w-5 h-auto md:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-xl transition-all ${
                      viewMode === "list" 
                        ? "bg-blue-500 text-white shadow-lg" 
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <List className="w-auto md:w-5 h-auto md:h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full mx-auto mb-4"
              />
              <p className="text-white/60 text-lg">Loading your research library...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 font-bold text-xl">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-400 text-lg">Error Loading Reports</h3>
                <p className="text-red-300/80">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredReports.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-gray-600/20 to-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <FileText className="w-12 h-12 text-white/40" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {searchTerm ? "No matching reports found" : "Your library is empty"}
            </h3>
            <p className="text-white/60 max-w-md mx-auto mb-8">
              {searchTerm 
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Start generating research reports to build your comprehensive financial analysis library."
              }
            </p>
            <div className="flex gap-4 justify-center">
              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm("")}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all border border-white/20"
                >
                  Clear Search
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Generate Report
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Reports Display */}
        {!loading && filteredReports.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Results Header */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8"
            >
              {/* <p className="text-white/60 text-lg">
                {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
              </p> */}
              <div className="flex items-center gap-2 text-white/40">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Updated {new Date().toLocaleDateString()}</span>
              </div>
            </motion.div>
            
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover="hover"
                    initial="rest"
                    className="group cursor-pointer"
                  >
                    <motion.div
                      variants={cardHoverVariants}
                      className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 h-full flex flex-col"
                    >
                      {/* File Type Indicator */}
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-all"
                        >
                          <FileText className="w-6 h-6 text-blue-400" />
                        </motion.div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* File Name */}
                      <h3 className="font-semibold text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors">
                        {report.filename}
                      </h3>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-sm text-white/50 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {report.file_size && (
                        <div className="text-xs text-white/40 mb-6 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {formatFileSize(report.file_size)}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-auto">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOpenReport(report.id)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteReport(report.id)}
                          className="bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 p-3 rounded-2xl transition-all duration-300 border border-white/20 hover:border-red-400/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ x: 10 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{report.filename}</h3>
                          <div className="flex items-center gap-4 text-sm text-white/50">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(report.created_at).toLocaleDateString()}</span>
                            </div>
                            {report.file_size && (
                              <div className="flex items-center gap-1">
                                <BarChart3 className="w-4 h-4" />
                                <span>{formatFileSize(report.file_size)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOpenReport(report.id)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteReport(report.id)}
                          className="bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 p-2.5 rounded-xl transition-all duration-300 border border-white/20 hover:border-red-400/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* PDF Modal */}
        <AnimatePresence>
          {storagePath && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-80 p-4"
              onClick={handleClosePdf}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Document Preview</h3>
                      <p className="text-white/60 text-sm">Research Report Analysis</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClosePdf}
                    className="text-white/40 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-2xl"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
                
                {/* PDF Content */}
                <div className="flex-1 p-8 overflow-auto bg-white/5">
                  {pdfBlobUrl ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <Document
                        file={pdfBlobUrl}
                        onLoadSuccess={({ numPages }) => {
                          console.log(`PDF loaded with ${numPages} pages`);
                          setNumPages(numPages);
                        }}
                        onLoadError={(error) => console.error("Error loading PDF:", error)}
                        className="shadow-2xl"
                      >
                        {Array.from(new Array(numPages), (el, index) => (
                          <motion.div
                            key={`page_${index + 1}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="mb-8 bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200/20"
                          >
                            <Page
                              pageNumber={index + 1}
                              width={Math.min(800, window.innerWidth - 200)}
                              className="rounded-2xl"
                            />
                          </motion.div>
                        ))}
                      </Document>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full mx-auto mb-4"
                        />
                        <p className="text-white/60 text-lg">Loading document...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Modal Footer */}
                <div className="flex justify-between items-center gap-4 p-8 border-t border-white/20 bg-white/5">
                  <div className="flex items-center gap-2 text-white/60">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">AI-Powered Analysis</span>
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClosePdf}
                      className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all duration-300 border border-white/20"
                    >
                      Close
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`${API_ENDPOINTS.previewPdf}?storage_path=${encodeURIComponent(storagePath)}&download=1`}
                      download
                      className="px-8 py-3 bg-gradient-to-r from-[#3fffad] to-[#00d4ff] hover:from-[#3fffacd1] hover:to-[#00d5ffd8]  text-black hover:text-black rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                    >
                      <Download className="w-4 h-4 text-black" />
                      Download
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Library;



