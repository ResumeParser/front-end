import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Uploader from './components/Uploader';
import ResumeViewer from './components/ResumeViewer';
import LoadingIndicator from './components/LoadingIndicator';
import Sidebar from './components/Sidebar';
import { FiMenu } from 'react-icons/fi';

// Definindo a interface aqui também para o estado
interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: {
    title: string;
    company: string;
    date: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    date: string;
  }[];
  skills: string[];
}

interface ArchivedResume extends ResumeData {
  id: string;
  filename: string;
  timestamp: string;
}

function App() {
  const [analyses, setAnalyses] = useState<ArchivedResume[]>([]);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    try {
      const storedAnalyses = localStorage.getItem('resumeAnalyses');
      if (storedAnalyses) {
        setAnalyses(JSON.parse(storedAnalyses));
      }
    } catch (e) {
      console.error("Failed to load analyses from localStorage", e);
      setAnalyses([]);
    }
  }, []);

  const handleGenerateSummary = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      const data: ResumeData = await response.json();
      const newAnalysis: ArchivedResume = {
        ...data,
        id: Date.now().toString(),
        filename: file.name,
        timestamp: new Date().toISOString(),
      };

      const updatedAnalyses = [...analyses, newAnalysis];
      setAnalyses(updatedAnalyses);
      localStorage.setItem('resumeAnalyses', JSON.stringify(updatedAnalyses));
      setCurrentAnalysisId(newAnalysis.id);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnalysis = (id: string) => {
    setError(null);
    setCurrentAnalysisId(id);
  };

  const handleNewAnalysis = () => {
    setError(null);
    setCurrentAnalysisId(null);
  };
  
  const currentAnalysis = analyses.find(a => a.id === currentAnalysisId);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex font-sans">
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 bg-gray-900/80 border-r border-gray-800 overflow-hidden"
      >
        <Sidebar 
          analyses={analyses} 
          currentAnalysisId={currentAnalysisId}
          onSelectAnalysis={handleSelectAnalysis}
          onNewAnalysis={handleNewAnalysis}
        />
      </motion.aside>

      <div className="flex-grow flex flex-col relative">
         <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-6 left-6 z-10 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={24} />
        </button>

        <header className="py-8 px-8 text-center relative border-b border-gray-800">
          <div className={`${isSidebarOpen ? '' : 'ml-12'}`}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
              Resume Summarizer AI
            </h1>
            <p className="mt-2 text-lg text-gray-300">
              {currentAnalysis ? currentAnalysis.filename : 'Upload a new resume to get started'}
            </p>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
               <motion.div key="loader"><LoadingIndicator /></motion.div>
            ) : error ? (
              <motion.div
                key="error"
                className="text-red-400 bg-red-900/50 p-4 rounded-lg"
              >
                <p className="font-bold">An error occurred:</p>
                <p>{error}</p>
              </motion.div>
            ) : currentAnalysis ? (
              <motion.div 
                key={currentAnalysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
              >
                <ResumeViewer data={currentAnalysis} />
              </motion.div>
            ) : (
              <motion.div key="uploader" className="w-full max-w-lg">
                <Uploader onFileSelect={handleGenerateSummary} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="py-6 px-4 md:px-8 text-center text-gray-500 border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} Resume Summarizer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App
