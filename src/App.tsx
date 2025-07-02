/**
 * RESUME PARSER - APLICAÇÃO FRONTEND PRINCIPAL
 * =============================================
 * 
 * Este é o componente principal da aplicação React que gerencia todo o estado
 * e fluxo da interface do usuário. Integra com a API backend para processamento
 * de currículos e exibição de resultados.
 * 
 * Funcionalidades principais:
 * - Upload de arquivos PDF
 * - Comunicação com API backend
 * - Gerenciamento de estado da aplicação
 * - Navegação entre diferentes views
 * - Histórico de análises processadas
 * - Interface responsiva com animações
 * 
 * Tecnologias utilizadas:
 * - React 19 com hooks (useState, useEffect)
 * - TypeScript para type safety
 * - Framer Motion para animações
 * - Tailwind CSS para estilização
 * - React Icons para ícones
 */

// Importações das bibliotecas React e utilitários
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';  // Animações fluidas

// Importações dos componentes customizados
import Uploader from './components/Uploader';           // Componente de upload de arquivos
import ResumeViewer from './components/ResumeViewer';   // Visualizador de currículos
import Sidebar from './components/Sidebar';             // Barra lateral com histórico

// Ícones da biblioteca react-icons
import { FiMenu } from 'react-icons/fi';               // Ícone do menu hamburguer

// =============================================================================
// CONFIGURAÇÃO DA API
// =============================================================================

// URL base da API backend - configurada para desenvolvimento local
const API_URL = 'http://localhost:8000';

// =============================================================================
// INTERFACES TYPESCRIPT
// =============================================================================

// Interface para dados básicos extraídos do currículo
interface ResumeData {
  name: string;        // Nome completo do candidato
  email: string;       // Email de contato
  phone: string;       // Telefone de contato
  summary: string;     // Resumo profissional
  experience: {        // Array de experiências profissionais
    title: string;     // Cargo/posição
    company: string;   // Nome da empresa
    date: string;      // Período de trabalho
    description: string; // Descrição das responsabilidades
  }[];
  education: {         // Array de formações educacionais
    degree: string;    // Nome do curso/diploma
    institution: string; // Instituição de ensino
    date: string;      // Período de estudo
  }[];
  skills: string[];    // Array de habilidades/competências
}

// Interface para currículo arquivado (herda ResumeData + metadados)
interface ArchivedResume extends ResumeData {
  id: string;          // UUID único da análise
  filename: string;    // Nome do arquivo original
  timestamp: string;   // Data/hora do processamento
}

// Interface para listagem simplificada de análises (usado no histórico)
interface AnalysisStub { 
  id: string;          // UUID da análise
  filename: string;    // Nome do arquivo
  timestamp: string;   // Data/hora do processamento
}

// =============================================================================
// COMPONENTE PRINCIPAL DA APLICAÇÃO
// =============================================================================

function App() {
  
  // =============================================================================
  // GERENCIAMENTO DE ESTADO
  // =============================================================================
  
  // Estado do histórico de análises (lista simplificada)
  const [history, setHistory] = useState<AnalysisStub[]>([]);
  
  // Estado da análise atual sendo visualizada (dados completos)
  const [currentAnalysis, setCurrentAnalysis] = useState<ArchivedResume | null>(null);
  
  // Estado de carregamento (usado durante processamento de PDF ou carregamento de dados)
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado de erro (mensagens de erro para o usuário)
  const [error, setError] = useState<string | null>(null);
  
  // Estado da sidebar (aberta/fechada)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Chave para forçar re-render do componente Uploader
  const [uploaderKey, setUploaderKey] = useState(0);

  // =============================================================================
  // EFEITO DE INICIALIZAÇÃO - CARREGAMENTO DO HISTÓRICO
  // =============================================================================
  
  // Effect hook que executa uma vez quando o componente é montado
  // Responsável por carregar o histórico de análises da API
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);  // Ativa estado de carregamento
      
      try {
        // Faz requisição GET para obter lista de análises
        const response = await fetch(`${API_URL}/analyses`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        
        // Converte resposta para JSON e atualiza estado
        const data: AnalysisStub[] = await response.json();
        setHistory(data);
        
      } catch (err) {
        // Trata erros e define mensagem apropriada
        const errorMessage = err instanceof Error ? err.message : 'Could not load history.';
        setError(errorMessage);
        
      } finally {
        // Sempre desativa o estado de carregamento
        setIsLoading(false);
      }
    };
    
    // Executa a função de carregamento
    fetchHistory();
  }, []); // Array vazio significa que executa apenas uma vez

  // =============================================================================
  // FUNÇÕES DE MANIPULAÇÃO DE EVENTOS
  // =============================================================================

  /**
   * FUNÇÃO PARA PROCESSAR NOVO CURRÍCULO
   * 
   * Esta é a função principal que gerencia o upload e processamento de um novo PDF.
   * Ela coordena toda a comunicação com a API backend e atualiza o estado da aplicação.
   * 
   * Fluxo:
   * 1. Valida se arquivo foi fornecido
   * 2. Ativa estado de carregamento
   * 3. Cria FormData com o arquivo
   * 4. Envia requisição POST para API
   * 5. Processa resposta e atualiza estado
   * 6. Adiciona nova análise ao histórico
   */
  const handleGenerateSummary = async (file: File) => {
    // Validação básica - verifica se arquivo foi fornecido
    if (!file) return;
    
    // Preparação do estado para processamento
    setIsLoading(true);           // Ativa indicador de carregamento
    setError(null);               // Limpa erros anteriores
    setCurrentAnalysis(null);     // Limpa análise atual

    // Preparação dos dados para envio
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Requisição POST para endpoint de processamento
      const response = await fetch(`${API_URL}/parse-resume`, {
        method: 'POST',
        body: formData,  // Envia arquivo como multipart/form-data
      });

      // Verifica se requisição foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      // Processa resposta bem-sucedida
      const newAnalysis: ArchivedResume = await response.json();
      setCurrentAnalysis(newAnalysis);  // Define como análise atual
      
      // Adiciona nova análise ao início do histórico
      setHistory(prevHistory => [newAnalysis, ...prevHistory]);

    } catch (err) {
      // Trata erros e define mensagem apropriada
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      
    } finally {
      // Sempre desativa o estado de carregamento
      setIsLoading(false);
    }
  };

  /**
   * FUNÇÃO PARA SELECIONAR ANÁLISE DO HISTÓRICO
   * 
   * Carrega dados completos de uma análise específica quando o usuário
   * clica em um item do histórico na sidebar.
   * 
   * Parâmetros:
   * - id: UUID da análise a ser carregada
   */
  const handleSelectAnalysis = async (id: string) => {
    // Evita recarregar se já está visualizando a mesma análise
    if (currentAnalysis?.id === id) return;

    // Preparação do estado para carregamento
    setIsLoading(true);
    setError(null);
    
    try {
      // Requisição GET para obter dados completos da análise
      const response = await fetch(`${API_URL}/analyses/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis details.');
      }

      // Processa resposta e atualiza estado
      const fullAnalysis: ArchivedResume = await response.json();
      setCurrentAnalysis(fullAnalysis);
      
    } catch (err) {
      // Trata erros
      const errorMessage = err instanceof Error ? err.message : 'Could not load analysis.';
      setError(errorMessage);
      
    } finally {
      // Desativa estado de carregamento
      setIsLoading(false);
    }
  };

  /**
   * FUNÇÃO PARA INICIAR NOVA ANÁLISE
   * 
   * Reseta o estado da aplicação para permitir upload de novo arquivo.
   * Chamada quando usuário clica no botão "New Analysis" na sidebar.
   */
  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);                    // Remove análise atual
    setError(null);                              // Limpa erros
    setUploaderKey(prevKey => prevKey + 1);      // Força re-render do Uploader
  };
  
  // =============================================================================
  // RENDERIZAÇÃO DA INTERFACE
  // =============================================================================
  
  // O JSX retornado define toda a estrutura visual da aplicação
  // Utiliza Tailwind CSS para estilização e Framer Motion para animações
  return (
    <div className="relative h-screen bg-gray-950 text-white font-sans">
      <div className="flex h-full overflow-hidden">
        
        {/* Sidebar animada que mostra histórico de análises */}
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

        {/* Área principal do conteúdo */}
        <div className="flex-grow flex flex-col relative overflow-y-auto">
          
          {/* Header com título e subtítulo dinâmico */}
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

          {/* Área principal - alterna entre uploader, visualizador e erro */}
          <main className="flex-grow flex flex-col items-center justify-center p-4">
            <AnimatePresence mode="wait">
              {error ? (
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
                  <Uploader
                    key={uploaderKey}
                    onFileSelect={handleGenerateSummary}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer com copyright */}
          <footer className="py-6 px-4 md:px-8 text-center text-gray-500 border-t border-gray-800 flex-shrink-0">
            <p>&copy; {new Date().getFullYear()} Resume Summarizer. All rights reserved.</p>
          </footer>
        </div>
      </div>
      
      {/* Botão flutuante para toggle da sidebar */}
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
