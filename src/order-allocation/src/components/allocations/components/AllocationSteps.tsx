import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface AllocationStepsProps {
  step: 1 | 2
}

export const AllocationSteps: React.FC<AllocationStepsProps> = ({ step }) => {
  return (
    <div className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border">
      <motion.div
        animate={{ backgroundColor: step === 1 ? 'hsl(var(--primary))' : 'hsl(var(--success, 142 72% 29%))' }}
        className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
      >
        {step === 1 ? '1' : <CheckCircle className="w-4 h-4" />}
      </motion.div>
      
      <Progress value={step === 2 ? 100 : 0} className="h-1.5 flex-1" />

      <motion.div
        animate={{ backgroundColor: step === 2 ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}
        className="flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground text-xs font-bold shrink-0"
        style={{ color: step === 2 ? '#fff' : undefined }}
      >
        2
      </motion.div>
    </div>
  )
}
