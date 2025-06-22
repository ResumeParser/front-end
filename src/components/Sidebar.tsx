import { FiPlus, FiFileText } from 'react-icons/fi';

interface AnalysisStub {
  id: string;
  filename: string;
}

interface SidebarProps {
  analyses: AnalysisStub[];
  currentAnalysisId: string | null;
  onSelectAnalysis: (id: string) => void;
  onNewAnalysis: () => void;
}

const Sidebar = ({ analyses, currentAnalysisId, onSelectAnalysis, onNewAnalysis }: SidebarProps) => {
  return (
    <div className="w-64 p-4 flex flex-col h-full">
      <h2 className="text-lg font-bold text-white mb-4">History</h2>
      <button
        onClick={onNewAnalysis}
        className="flex items-center justify-center w-full p-2 mb-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FiPlus className="mr-2" />
        New Analysis
      </button>
      <div className="flex-grow overflow-y-auto">
        <ul>
          {analyses.map((analysis) => (
            <li key={analysis.id} className="mb-2">
              <button
                onClick={() => onSelectAnalysis(analysis.id)}
                className={`flex items-center w-full text-left p-2 rounded-md transition-colors ${
                  currentAnalysisId === analysis.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <FiFileText className="mr-3 flex-shrink-0" />
                <span className="truncate">{analysis.filename}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 