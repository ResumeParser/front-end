import { useState } from 'react';
import Uploader from './components/Uploader';
import SummaryDisplay from './components/SummaryDisplay';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setFile(null);
    setSummary(null);
  };

  // Simula a geração de um resumo
  const handleGenerateSummary = () => {
    if (!file) return;
    setIsLoading(true);
    setTimeout(() => {
      setSummary("Este é um resumo de exemplo gerado para o currículo.\\nEle destaca as principais habilidades e experiências do candidato de uma forma concisa e profissional.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="py-8 px-4 md:px-8 text-center relative">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Resume Summarizer AI
        </h1>
        <p className="mt-2 text-lg text-gray-300">
          {summary ? 'Here is your summary:' : 'Simply upload your resume and get a professional summary in seconds.'}
        </p>
        {(file || summary) && (
          <button onClick={handleReset} className="absolute top-8 right-8 text-sm text-gray-400 hover:text-white transition-colors">
            Upload Another
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {!file ? (
          <Uploader onFileSelect={setFile} />
        ) : (
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-2xl font-semibold mb-4">{file.name}</h2>
            {isLoading ? (
              <p>Generating summary...</p>
            ) : summary ? (
              <SummaryDisplay summary={summary} />
            ) : (
              <button onClick={handleGenerateSummary} className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                Generate Summary
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="py-6 px-4 md:px-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Resume Summarizer. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
