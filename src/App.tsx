import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Uploader from './components/Uploader';
import ResumeViewer from './components/ResumeViewer';
import LoadingIndicator from './components/LoadingIndicator';
import Sidebar from './components/Sidebar';
import { FiMenu } from 'react-icons/fi';

const API_URL = 'http://localhost:8000';

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

interface AnalysisStub { id: string; filename: string; timestamp: string; }

function App() {
  const [history, setHistory] = useState<AnalysisStub[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<ArchivedResume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch initial history
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/analyses`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const data: AnalysisStub[] = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleGenerateSummary = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      const newAnalysis: ArchivedResume = await response.json();
      setCurrentAnalysis(newAnalysis);
      setHistory(prevHistory => [newAnalysis, ...prevHistory]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnalysis = async (id: string) => {
    if (currentAnalysis?.id === id) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/analyses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch analysis details.');

      const fullAnalysis: ArchivedResume = await response.json();
      setCurrentAnalysis(fullAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setError(null);
  };
  
  return (
    <div className="relative h-screen bg-gray-950 text-white font-sans">
      <div className="flex h-full overflow-hidden">
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 bg-gray-900/80 border-r border-gray-800 overflow-hidden"
        >
          <Sidebar
            analyses={history}
            currentAnalysisId={currentAnalysis?.id || null}
            onSelectAnalysis={handleSelectAnalysis}
            onNewAnalysis={handleNewAnalysis}
          />
        </motion.aside>

        <div className="flex-grow flex flex-col relative overflow-y-auto">
          <header className="py-8 px-8 text-center relative border-b border-gray-800 flex-shrink-0">
            <div className="pl-16">
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
              {error ? (
                <motion.div key="error" className="text-red-400 bg-red-900/50 p-4 rounded-lg">
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
                  <Uploader onFileSelect={handleGenerateSummary} isLoading={isLoading} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <footer className="py-6 px-4 md:px-8 text-center text-gray-500 border-t border-gray-800 flex-shrink-0">
            <p>&copy; {new Date().getFullYear()} Resume Summarizer. All rights reserved.</p>
          </footer>
        </div>
      </div>
      <motion.button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-6 z-20 p-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Toggle sidebar"
        animate={{ left: isSidebarOpen ? '272px' : '24px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <FiMenu size={24} />
      </motion.button>
    </div>
  );
}

export default App
