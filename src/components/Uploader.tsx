import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { FiFileText, FiUploadCloud, FiRefreshCw, FiPlay } from 'react-icons/fi';

interface UploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const loadingContainerVariants = {
  start: { transition: { staggerChildren: 0.15 } },
  end: { transition: { staggerChildren: 0.15 } },
};

const loadingCircleVariants = {
  start: { y: "0%" },
  end: { y: "100%" },
};

const loadingCircleTransition = {
  duration: 0.4,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
};

const Uploader = ({ onFileSelect, isLoading }: UploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    noClick: !!selectedFile,
    noKeyboard: !!selectedFile,
    disabled: isLoading,
  });

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg"
    >
      <div {...getRootProps()} className={`p-8 border-2 border-dashed border-gray-700 rounded-xl text-center transition-all duration-300 ease-in-out ${!selectedFile || isLoading ? 'hover:border-gray-500 cursor-pointer' : ''} ${isDragActive ? 'border-gray-500 bg-gray-900' : ''} ${isLoading ? 'cursor-default' : ''}`}>
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <FiUploadCloud className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Drag and drop your PDF here</p>
              <p className="text-sm text-gray-600 mt-2">or click to select a file (PDF only)</p>
            </motion.div>
          ) : (
            <motion.div
              key="file-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <FiFileText className="w-12 h-12 text-blue-400 mb-4" />
              <p className="text-gray-200 font-medium break-all">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              
              <div className="mt-6 w-full">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center space-y-4 py-4"
                    >
                      <motion.div
                        className="flex justify-center items-center h-4 space-x-2"
                        variants={loadingContainerVariants}
                        initial="start"
                        animate="end"
                      >
                        <motion.span className="block w-2.5 h-2.5 bg-gray-400 rounded-full" variants={loadingCircleVariants} transition={loadingCircleTransition} />
                        <motion.span className="block w-2.5 h-2.5 bg-gray-400 rounded-full" variants={loadingCircleVariants} transition={loadingCircleTransition} />
                        <motion.span className="block w-2.5 h-2.5 bg-gray-400 rounded-full" variants={loadingCircleVariants} transition={loadingCircleTransition} />
                      </motion.div>
                      <p className="text-gray-400">Analyzing...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex space-x-4 justify-center"
                    >
                      <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <FiRefreshCw size={16} />
                        <span>Change File</span>
                      </button>
                      <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <FiPlay size={16} />
                        <span>Analyze</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Uploader; 