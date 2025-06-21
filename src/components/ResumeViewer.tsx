import { motion } from 'framer-motion';
import { FiBriefcase, FiBookOpen, FiAward, FiMail, FiPhone } from 'react-icons/fi';

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

interface ResumeViewerProps {
  data: ResumeData;
}

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <motion.section 
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <h3 className="flex items-center text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 border-b-2 border-gray-800 pb-3">
      <span className="mr-3 text-gray-400">{icon}</span>
      {title}
    </h3>
    {children}
  </motion.section>
);

const ResumeViewer = ({ data }: ResumeViewerProps) => {
  return (
    <div className="w-full max-w-4xl p-8 md:p-12 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50">
      <header className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-white">{data.name}</h2>
        <div className="flex justify-center items-center gap-6 text-gray-400 mt-4">
          <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-gray-100 transition-colors">
            <FiMail size={18} />
            <span>{data.email}</span>
          </a>
          <span className="flex items-center gap-2 text-gray-400">
            <FiPhone size={18} />
            <span>{data.phone}</span>
          </span>
        </div>
      </header>

      <Section title="Professional Summary" icon={<FiBriefcase />}>
        <p className="text-gray-300 leading-relaxed">{data.summary}</p>
      </Section>

      <Section title="Work Experience" icon={<FiBriefcase />}>
        <div className="relative border-l-2 border-gray-800 pl-8">
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-10 ml-4 relative">
              <div className="absolute w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-300 rounded-full -left-[42px] mt-1.5 border-2 border-gray-950"></div>
              <p className="text-sm font-semibold text-gray-500">{exp.date}</p>
              <h4 className="text-xl font-semibold text-white mt-1">{exp.title}</h4>
              <p className="text-md text-gray-400 mb-2">{exp.company}</p>
              <p className="text-gray-300 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education" icon={<FiBookOpen />}>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
            <p className="text-md text-gray-400">{edu.institution} | {edu.date}</p>
          </div>
        ))}
      </Section>

      <Section title="Skills" icon={<FiAward />}>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, index) => (
            <span key={index} className="bg-gray-700/50 text-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300">{skill}</span>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ResumeViewer; 