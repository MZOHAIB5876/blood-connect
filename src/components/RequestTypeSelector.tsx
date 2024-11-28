import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RequestTypeSelectorProps {
  value: 'donor' | 'receiver';
  onChange: (value: 'donor' | 'receiver') => void;
}

export function RequestTypeSelector({ value, onChange }: RequestTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-1">
      <motion.button
        type="button"
        onClick={() => onChange('donor')}
        className={cn(
          'relative p-6 rounded-lg border-2 transition-colors duration-200',
          'flex flex-col items-center justify-center gap-2',
          'hover:bg-red-50',
          value === 'donor' ? 'border-red-500 bg-red-50' : 'border-gray-200'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-4xl">🩸</span>
        <span className={cn(
          'font-semibold',
          value === 'donor' ? 'text-red-500' : 'text-gray-700'
        )}>
          Donor
        </span>
        {value === 'donor' && (
          <motion.div
            className="absolute -z-10 inset-0 bg-red-100 rounded-lg"
            layoutId="activeType"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>

      <motion.button
        type="button"
        onClick={() => onChange('receiver')}
        className={cn(
          'relative p-6 rounded-lg border-2 transition-colors duration-200',
          'flex flex-col items-center justify-center gap-2',
          'hover:bg-blue-50',
          value === 'receiver' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-4xl">🏥</span>
        <span className={cn(
          'font-semibold',
          value === 'receiver' ? 'text-blue-500' : 'text-gray-700'
        )}>
          Receiver
        </span>
        {value === 'receiver' && (
          <motion.div
            className="absolute -z-10 inset-0 bg-blue-100 rounded-lg"
            layoutId="activeType"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>
    </div>
  );
}
