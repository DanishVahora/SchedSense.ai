import { motion } from 'framer-motion';

interface LineProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const Line = ({ direction = 'horizontal', className = '' }: LineProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.2 }}
      transition={{ duration: 1.5 }}
      className={`bg-gradient-to-r from-transparent via-white to-transparent ${
        direction === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px] h-full'
      } ${className}`}
    />
  );
};