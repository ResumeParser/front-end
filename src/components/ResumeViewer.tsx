/**
 * COMPONENTE RESUMEVIEWER - VISUALIZADOR DE CURRÍCULOS
 * ===================================================
 * 
 * Este componente é responsável por exibir os dados estruturados
 * extraídos de um currículo de forma organizada e visualmente atrativa.
 * 
 * Funcionalidades principais:
 * - Exibição de informações pessoais (nome, email, telefone)
 * - Apresentação do resumo profissional
 * - Timeline visual das experiências profissionais
 * - Lista de formações educacionais
 * - Tags de habilidades/competências
 * - Design responsivo com animações suaves
 * 
 * Layout estruturado em seções:
 * 1. Header - Nome e informações de contato
 * 2. Resumo Profissional - Texto descritivo
 * 3. Experiência Profissional - Timeline com detalhes
 * 4. Educação - Lista de formações
 * 5. Habilidades - Tags organizadas
 * 
 * Tecnologias utilizadas:
 * - Framer Motion para animações
 * - React Icons para ícones temáticos
 * - Tailwind CSS para estilização responsiva
 * - Gradientes e sombras para design moderno
 */

// Importações das bibliotecas
import { motion } from 'framer-motion';  // Animações
import { FiBriefcase, FiBookOpen, FiAward, FiMail, FiPhone } from 'react-icons/fi';  // Ícones

// =============================================================================
// INTERFACES TYPESCRIPT
// =============================================================================

// Interface para os dados do currículo (estrutura recebida da API)
interface ResumeData {
  name: string;        // Nome completo do candidato
  email: string;       // Email de contato
  phone: string;       // Telefone de contato
  summary: string;     // Resumo/objetivo profissional
  experience: {        // Array de experiências profissionais
    title: string;     // Cargo/posição
    company: string;   // Nome da empresa
    date: string;      // Período de trabalho
    description: string; // Descrição das atividades
  }[];
  education: {         // Array de formações educacionais
    degree: string;    // Nome do curso/diploma
    institution: string; // Instituição de ensino
    date: string;      // Período de estudo
  }[];
  skills: string[];    // Array de habilidades
}

// Interface para as props do componente
interface ResumeViewerProps {
  data: ResumeData;    // Dados completos do currículo para exibição
}

// =============================================================================
// COMPONENTE AUXILIAR PARA SEÇÕES
// =============================================================================

/**
 * COMPONENTE SECTION - WRAPPER PARA SEÇÕES DO CURRÍCULO
 * 
 * Componente reutilizável que padroniza a apresentação de cada seção
 * do currículo (experiência, educação, habilidades, etc.)
 * 
 * Características:
 * - Header com ícone e título
 * - Animação de entrada consistente
 * - Estilo padronizado com gradiente
 * - Border bottom para separação visual
 * 
 * Props:
 * - title: Título da seção
 * - icon: Ícone React para identificação visual
 * - children: Conteúdo da seção
 */
const Section = ({ title, icon, children }: { 
  title: string, 
  icon: React.ReactNode, 
  children: React.ReactNode 
}) => (
  <motion.section 
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}      // Animação de entrada
    animate={{ opacity: 1, y: 0 }}       // Estado final
    transition={{ duration: 0.5, delay: 0.2 }}  // Delay para efeito escalonado
  >
    {/* Header da seção com ícone e título */}
    <h3 className="flex items-center text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 border-b-2 border-gray-800 pb-3">
      <span className="mr-3 text-gray-400">{icon}</span>
      {title}
    </h3>
    {/* Conteúdo da seção */}
    {children}
  </motion.section>
);

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const ResumeViewer = ({ data }: ResumeViewerProps) => {
  
  // Renderiza o layout completo do currículo com todas as seções
  return (
    <div className="w-full max-w-4xl p-8 md:p-12 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50">
      {/* ========================================================= */}
      {/* HEADER - INFORMAÇÕES PESSOAIS */}
      {/* ========================================================= */}
      
      <header className="text-center mb-12">
        {/* Nome principal em destaque */}
        <h2 className="text-5xl font-extrabold text-white">{data.name}</h2>
        
        {/* Informações de contato */}
        <div className="flex justify-center items-center gap-6 text-gray-400 mt-4">
          {/* Email clicável */}
          <a 
            href={`mailto:${data.email}`} 
            className="flex items-center gap-2 hover:text-gray-100 transition-colors"
          >
            <FiMail size={18} />
            <span>{data.email}</span>
          </a>
          
          {/* Telefone */}
          <span className="flex items-center gap-2 text-gray-400">
            <FiPhone size={18} />
            <span>{data.phone}</span>
          </span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SEÇÃO: RESUMO PROFISSIONAL */}
      {/* ========================================================= */}
      
      <Section title="Professional Summary" icon={<FiBriefcase />}>
        <p className="text-gray-300 leading-relaxed">{data.summary}</p>
      </Section>

      {/* ========================================================= */}
      {/* SEÇÃO: EXPERIÊNCIA PROFISSIONAL */}
      {/* ========================================================= */}
      
      <Section title="Work Experience" icon={<FiBriefcase />}>
        {/* Timeline visual com linha vertical */}
        <div className="relative border-l-2 border-gray-800 pl-8">
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-10 ml-4 relative">
              {/* Marcador circular na timeline */}
              <div className="absolute w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-300 rounded-full -left-[42px] mt-1.5 border-2 border-gray-950"></div>
              
              {/* Informações da experiência */}
              <p className="text-sm font-semibold text-gray-500">{exp.date}</p>
              <h4 className="text-xl font-semibold text-white mt-1">{exp.title}</h4>
              <p className="text-md text-gray-400 mb-2">{exp.company}</p>
              <p className="text-gray-300 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ========================================================= */}
      {/* SEÇÃO: EDUCAÇÃO */}
      {/* ========================================================= */}
      
      <Section title="Education" icon={<FiBookOpen />}>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
            <p className="text-md text-gray-400">{edu.institution} | {edu.date}</p>
          </div>
        ))}
      </Section>

      {/* ========================================================= */}
      {/* SEÇÃO: HABILIDADES */}
      {/* ========================================================= */}
      
      <Section title="Skills" icon={<FiAward />}>
        {/* Tags de habilidades com layout flexível */}
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-gray-700/50 text-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ResumeViewer; 