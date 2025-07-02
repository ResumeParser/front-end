/**
 * COMPONENTE UPLOADER - UPLOAD DE ARQUIVOS PDF
 * ============================================
 * 
 * Este componente gerencia o upload de arquivos PDF de currículos.
 * Oferece funcionalidade de drag-and-drop e seleção manual de arquivos.
 * 
 * Funcionalidades principais:
 * - Drag and drop de arquivos PDF
 * - Validação de tipo de arquivo (apenas PDF)
 * - Preview do arquivo selecionado
 * - Estados visuais (vazio, arquivo selecionado, processando)
 * - Animações fluidas entre estados
 * - Feedback visual durante carregamento
 * 
 * Estados do componente:
 * 1. Estado vazio - aguardando seleção de arquivo
 * 2. Estado com arquivo - mostra informações e botões de ação
 * 3. Estado de carregamento - animação de processamento
 * 
 * Tecnologias utilizadas:
 * - React Dropzone para funcionalidade de drag-and-drop
 * - Framer Motion para animações
 * - React Icons para ícones
 * - useState para gerenciamento de estado local
 */

// Importações das bibliotecas
import { motion, AnimatePresence } from 'framer-motion';  // Animações
import { useDropzone } from 'react-dropzone';           // Drag and drop
import { useCallback, useState } from 'react';          // React hooks
import { FiFileText, FiUploadCloud, FiRefreshCw, FiPlay } from 'react-icons/fi'; // Ícones

// Interface para as props do componente
interface UploaderProps {
  onFileSelect: (file: File) => void;  // Callback chamado quando arquivo é selecionado para análise
  isLoading: boolean;                  // Estado de carregamento vindo do componente pai
}

// =============================================================================
// CONFIGURAÇÕES DE ANIMAÇÃO
// =============================================================================

// Variantes de animação para o container dos círculos de loading
// Controla o timing escalonado (stagger) dos elementos filhos
const loadingContainerVariants = {
  start: { transition: { staggerChildren: 0.15 } }, // Intervalo entre animações dos filhos
  end: { transition: { staggerChildren: 0.15 } },
};

// Variantes de animação para cada círculo individual
// Cria movimento vertical de "bounce" para cada círculo
const loadingCircleVariants = {
  start: { y: "0%" },    // Posição inicial
  end: { y: "100%" },    // Posição final (movimento para baixo)
};

// Configuração da transição para os círculos de loading
// Define duração, repetição e easing da animação
const loadingCircleTransition = {
  duration: 0.4,                    // Duração de cada ciclo de animação
  repeat: Infinity,                 // Repete infinitamente
  repeatType: 'mirror' as const,    // Tipo de repetição (ida e volta)
  ease: 'easeInOut' as const,       // Curva de easing suave
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const Uploader = ({ onFileSelect, isLoading }: UploaderProps) => {
  
  // =============================================================================
  // ESTADO INTERNO DO COMPONENTE
  // =============================================================================
  
  // Estado para armazenar o arquivo selecionado
  // null = nenhum arquivo selecionado, File = arquivo PDF selecionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // =============================================================================
  // FUNÇÕES DE MANIPULAÇÃO DE ARQUIVOS
  // =============================================================================
  
  /**
   * CALLBACK PARA QUANDO ARQUIVOS SÃO SOLTOS NA ZONA DE DROP
   * 
   * Esta função é chamada pelo React Dropzone quando arquivos são
   * arrastados e soltos na área designada ou selecionados via dialog.
   * 
   * Parâmetros:
   * - acceptedFiles: Array de arquivos que passaram na validação
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Seleciona apenas o primeiro arquivo (componente aceita apenas um por vez)
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []); // Array vazio significa que a função nunca muda

  // =============================================================================
  // CONFIGURAÇÃO DO REACT DROPZONE
  // =============================================================================
  
  // Hook do react-dropzone que fornece props e estado para drag-and-drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,                                        // Callback quando arquivos são soltos
    accept: { 'application/pdf': ['.pdf'] },       // Aceita apenas arquivos PDF
    noClick: !!selectedFile,                       // Desabilita click quando arquivo já selecionado
    noKeyboard: !!selectedFile,                    // Desabilita navegação por teclado quando arquivo selecionado
    disabled: isLoading,                           // Desabilita durante carregamento
  });

  // =============================================================================
  // FUNÇÕES DE AÇÃO
  // =============================================================================
  
  /**
   * FUNÇÃO PARA INICIAR ANÁLISE DO ARQUIVO
   * 
   * Chama o callback do componente pai para processar o arquivo selecionado.
   * Só executa se houver um arquivo válido selecionado.
   */
  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);  // Chama callback do componente pai
    }
  };

  /**
   * FUNÇÃO PARA RESETAR SELEÇÃO DE ARQUIVO
   * 
   * Remove o arquivo selecionado e retorna o componente ao estado inicial.
   * Permite ao usuário selecionar um novo arquivo.
   */
  const handleReset = () => {
    setSelectedFile(null);  // Limpa o arquivo selecionado
  };

  // =============================================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // =============================================================================
  
  // O componente renderiza diferentes estados baseado no arquivo selecionado e status de loading
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}    // Animação de entrada
      animate={{ opacity: 1, y: 0 }}     // Estado final da animação
      exit={{ opacity: 0, y: -20 }}      // Animação de saída
      transition={{ duration: 0.5 }}     // Duração das transições
      className="w-full max-w-lg"
    >
      {/* Área principal de drop com estilos dinâmicos */}
      <div 
        {...getRootProps()} 
        className={`p-8 border-2 border-dashed border-gray-700 rounded-xl text-center transition-all duration-300 ease-in-out ${
          !selectedFile || isLoading ? 'hover:border-gray-500 cursor-pointer' : ''
        } ${
          isDragActive ? 'border-gray-500 bg-gray-900' : ''
        } ${
          isLoading ? 'cursor-default' : ''
        }`}
      >
        {/* Input file oculto (gerenciado pelo react-dropzone) */}
        <input {...getInputProps()} />
        
        {/* Animação entre diferentes estados do componente */}
        <AnimatePresence mode="wait">
          
          {/* ESTADO 1: Nenhum arquivo selecionado */}
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
            
          /* ESTADO 2: Arquivo selecionado */
          ) : (
            <motion.div
              key="file-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              {/* Ícone e informações do arquivo */}
              <FiFileText className="w-12 h-12 text-blue-400 mb-4" />
              <p className="text-gray-200 font-medium break-all">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              
              {/* Área de ações (botões ou loading) */}
              <div className="mt-6 w-full">
                <AnimatePresence mode="wait">
                  
                  {/* SUB-ESTADO: Processando (loading) */}
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center space-y-4 py-4"
                    >
                      {/* Animação de loading com círculos saltitantes */}
                      <motion.div
                        className="flex justify-center items-center h-4 space-x-2"
                        variants={loadingContainerVariants}
                        initial="start"
                        animate="end"
                      >
                        <motion.span 
                          className="block w-2.5 h-2.5 bg-gray-400 rounded-full" 
                          variants={loadingCircleVariants} 
                          transition={loadingCircleTransition} 
                        />
                        <motion.span 
                          className="block w-2.5 h-2.5 bg-gray-400 rounded-full" 
                          variants={loadingCircleVariants} 
                          transition={loadingCircleTransition} 
                        />
                        <motion.span 
                          className="block w-2.5 h-2.5 bg-gray-400 rounded-full" 
                          variants={loadingCircleVariants} 
                          transition={loadingCircleTransition} 
                        />
                      </motion.div>
                      <p className="text-gray-400">Analyzing...</p>
                    </motion.div>
                    
                  /* SUB-ESTADO: Botões de ação */
                  ) : (
                    <motion.div
                      key="buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex space-x-4 justify-center"
                    >
                      {/* Botão para trocar arquivo */}
                      <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <FiRefreshCw size={16} />
                        <span>Change File</span>
                      </button>
                      
                      {/* Botão para iniciar análise */}
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