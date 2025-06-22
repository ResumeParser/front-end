import { motion } from 'framer-motion';

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.15,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: "50%",
  },
  end: {
    y: "150%",
  },
};

const loadingCircleTransition = {
  duration: 0.4,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
};

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4">
      <motion.div
        className="flex justify-center items-center h-6 space-x-2"
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        <motion.span className="block w-3 h-3 bg-gray-400 rounded-full" variants={loadingCircleVariants} transition={loadingCircleTransition} />
        <motion.span className="block w-3 h-3 bg-gray-400 rounded-full" variants={loadingCircleVariants} transition={loadingCircleTransition} />
        <motion.span className="block w-3 h-3 bg-gray-400 rounded-full" variants={loadingCircleVariants} transition={loadingCircleTransition} />
      </motion.div>
      <p className="text-gray-400">Extracting information...</p>
    </div>
  );
};

export default LoadingIndicator; 