import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';

interface UploaderProps {
  onFileSelect: (file: File) => void;
}

const Uploader = ({ onFileSelect }: UploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg"
    >
      <div {...getRootProps()} className={`p-10 border-2 border-dashed border-gray-700 rounded-xl text-center hover:border-gray-500 transition-colors cursor-pointer ${isDragActive ? 'border-gray-500 bg-gray-900' : ''}`}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p className="text-gray-300">Drop the PDF here ...</p> :
            <>
              <p className="text-gray-400">Drag and drop your PDF here</p>
              <p className="text-sm text-gray-600 mt-2">or click to select a file (PDF only)</p>
            </>
        }
      </div>
    </motion.div>
  );
};

export default Uploader; 