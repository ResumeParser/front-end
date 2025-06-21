import { useState } from 'react';
import Uploader from './components/Uploader';
import ResumeViewer from './components/ResumeViewer';

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

const mockResumeData: ResumeData = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "123-456-7890",
  summary: "A highly skilled and motivated software engineer with 5 years of experience in developing and scaling web applications. Proficient in JavaScript, React, and Node.js.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      date: "Jan 2021 - Present",
      description: "Led the development of a new microservices-based architecture, improving system scalability by 40%. Mentored junior developers and conducted code reviews."
    },
    {
      title: "Software Engineer",
      company: "Innovate Co.",
      date: "Jun 2018 - Dec 2020",
      description: "Developed and maintained features for a large-scale e-commerce platform using React and Redux. Wrote unit and integration tests to ensure code quality."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "State University",
      date: "2014 - 2018"
    }
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "Docker", "AWS"]
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setFile(null);
    setResumeData(null);
  };

  const handleGenerateSummary = () => {
    if (!file) return;
    setIsLoading(true);
    setTimeout(() => {
      setResumeData(mockResumeData);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      <header className="py-8 px-4 md:px-8 text-center relative">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
          Resume Summarizer AI
        </h1>
        <p className="mt-2 text-lg text-gray-300">
          {resumeData ? 'Here is your structured resume:' : 'Simply upload your resume and get a professional summary in seconds.'}
        </p>
        {(file || resumeData) && (
          <button onClick={handleReset} className="absolute top-8 right-8 text-sm text-gray-400 hover:text-white transition-colors">
            Upload Another
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {!file ? (
          <Uploader onFileSelect={setFile} />
        ) : (
          <div className="w-full max-w-4xl text-center">
            <h2 className="text-2xl font-semibold mb-4">{file.name}</h2>
            {isLoading ? (
              <p>Extracting information...</p>
            ) : resumeData ? (
              <ResumeViewer data={resumeData} />
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
