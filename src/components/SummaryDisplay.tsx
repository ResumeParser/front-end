import { motion } from 'framer-motion';

interface SummaryDisplayProps {
  summary: string;
}

const SummaryDisplay = ({ summary }: SummaryDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-2xl p-6 bg-gray-900 border border-gray-700 rounded-lg"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-200">Summary</h3>
      <div className="prose prose-invert max-w-none">
        {summary.split('\\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </motion.div>
  );
};

export default SummaryDisplay; 