import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface WorkflowProgressProps {
  steps: string[];
  currentStep: number;
}

export function WorkflowProgress({ steps, currentStep }: WorkflowProgressProps) {
  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-20">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors shrink-0',
                  isComplete
                    ? 'bg-green-600 border-green-600 text-white'
                    : isCurrent
                      ? 'bg-white border-green-600 text-green-600'
                      : 'bg-white border-slate-200 text-slate-400'
                )}
              >
                {isComplete ? <Check size={14} /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs font-medium mt-1.5 text-center truncate w-full px-1',
                  isCurrent ? 'text-green-700' : isComplete ? 'text-slate-600' : 'text-slate-400'
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 min-w-4 -mt-5',
                  index < currentStep ? 'bg-green-600' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
