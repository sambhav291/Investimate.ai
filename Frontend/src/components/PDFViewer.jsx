import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, X, Download, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useFetchWithAuth } from '../utils/fetchWithAuth';
import { API_ENDPOINTS } from '../utils/apiConfig';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ storagePath, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const fetchWithAuth = useFetchWithAuth();
  const lastStoragePathRef = useRef(null);

  // Fetch PDF blob when component mounts
  useEffect(() => {
    // Prevent re-fetching if storagePath hasn't actually changed
    if (!storagePath || storagePath === lastStoragePathRef.current) return;
    
    lastStoragePathRef.current = storagePath;
    
    const fetchPDF = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('[PDF VIEWER] Fetching PDF for path:', storagePath);
        const response = await fetchWithAuth(`${API_ENDPOINTS.previewPdf}?storage_path=${encodeURIComponent(storagePath)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`);
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
        console.log('[PDF VIEWER] PDF blob created successfully');
        
      } catch (err) {
        console.error('[PDF VIEWER] Error fetching PDF:', err);
        setError('Failed to load PDF document');
        setLoading(false);
      }
    };

    fetchPDF();

    // Cleanup function to revoke blob URL
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [storagePath]); // Only depend on storagePath

  // Use useCallback to prevent recreation on every render
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    console.log('PDF loaded with', numPages, 'pages');
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error) => {
    console.error('PDF load error:', error);
    setError('Failed to load PDF');
    setLoading(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-80 p-4"
      onClick={onClose}
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
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-2xl"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>
        
        {/* PDF Content */}
        <div className="flex-1 p-8 overflow-auto bg-white/5">
          {loading && (
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

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-red-400">
                <p className="text-lg">{error}</p>
              </div>
            </div>
          )}

          {pdfBlobUrl && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <Document
                file={pdfBlobUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null} // Disable default loading component
                error={null}   // Disable default error component
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
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </motion.div>
                ))}
              </Document>
            </motion.div>
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
              onClick={onClose}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all duration-300 border border-white/20"
            >
              Close
            </motion.button>
            {storagePath && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`${API_ENDPOINTS.previewPdf}?storage_path=${encodeURIComponent(storagePath)}&download=1`}
                download
                className="px-8 py-3 bg-gradient-to-r from-[#3fffad] to-[#00d4ff] hover:from-[#3fffacd1] hover:to-[#00d5ffd8] text-black hover:text-black rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
              >
                <Download className="w-4 h-4 text-black" />
                Download
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

PDFViewer.propTypes = {
  storagePath: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PDFViewer;
