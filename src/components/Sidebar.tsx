/**
 * COMPONENTE SIDEBAR - NAVEGAÇÃO E HISTÓRICO
 * ==========================================
 * 
 * Este componente implementa a barra lateral da aplicação que contém
 * o histórico de análises processadas e botão para nova análise.
 * 
 * Funcionalidades principais:
 * - Listagem do histórico de análises
 * - Navegação entre análises processadas
 * - Botão para iniciar nova análise
 * - Indicação visual da análise ativa
 * - Scroll automático para listas longas
 * - Truncamento de nomes de arquivo longos
 * 
 * Estados visuais:
 * - Item ativo: Destacado com fundo escuro
 * - Item inativo: Cinza com hover effect
 * - Lista vazia: Apenas o botão de nova análise
 * 
 * Tecnologias utilizadas:
 * - React Icons para ícones
 * - Tailwind CSS para responsividade
 * - Truncate para nomes de arquivo longos
 */

// Importações
import { FiPlus, FiFileText } from 'react-icons/fi';  // Ícones

// =============================================================================
// INTERFACES TYPESCRIPT
// =============================================================================

// Interface para item do histórico (versão simplificada)
interface AnalysisStub {
  id: string;        // UUID único da análise
  filename: string;  // Nome do arquivo original
}

// Interface para as props do componente
interface SidebarProps {
  analyses: AnalysisStub[];                      // Lista de análises do histórico
  currentAnalysisId: string | null;             // ID da análise atualmente ativa
  onSelectAnalysis: (id: string) => void;       // Callback para seleção de análise
  onNewAnalysis: () => void;                     // Callback para nova análise
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const Sidebar = ({ analyses, currentAnalysisId, onSelectAnalysis, onNewAnalysis }: SidebarProps) => {
  return (
    <div className="w-64 p-4 flex flex-col h-full">
      
      {/* ========================================================= */}
      {/* HEADER DA SIDEBAR */}
      {/* ========================================================= */}
      
      <h2 className="text-lg font-bold text-white mb-4">History</h2>
      
      {/* ========================================================= */}
      {/* BOTÃO PARA NOVA ANÁLISE */}
      {/* ========================================================= */}
      
      <button
        onClick={onNewAnalysis}
        className="flex items-center justify-center w-full p-2 mb-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FiPlus className="mr-2" />
        New Analysis
      </button>
      
      {/* ========================================================= */}
      {/* LISTA DO HISTÓRICO */}
      {/* ========================================================= */}
      
      {/* Container com scroll para listas longas */}
      <div className="flex-grow overflow-y-auto">
        <ul>
          {analyses.map((analysis) => (
            <li key={analysis.id} className="mb-2">
              {/* Botão para cada item do histórico */}
              <button
                onClick={() => onSelectAnalysis(analysis.id)}
                className={`flex items-center w-full text-left p-2 rounded-md transition-colors ${
                  currentAnalysisId === analysis.id
                    ? 'bg-gray-700 text-white'        // Estilo do item ativo
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'  // Estilo do item inativo
                }`}
              >
                {/* Ícone do arquivo */}
                <FiFileText className="mr-3 flex-shrink-0" />
                
                {/* Nome do arquivo com truncamento */}
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