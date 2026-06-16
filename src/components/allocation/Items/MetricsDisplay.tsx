import { AlertCircle, Loader2 } from 'lucide-react';
import type { DemandMetrics } from './types';

interface MetricsDisplayProps {
  itemName: string;
  isLoading: boolean;
  error: string | undefined;
  metrics: DemandMetrics | undefined;
}

export function MetricsDisplay({ itemName, isLoading, error, metrics }: MetricsDisplayProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-x-2 gap-y-0.5 flex-wrap text-[10px] font-medium text-slate-500 bg-slate-50/80 px-1.5 py-0.5 rounded border border-slate-100 max-w-max">
        <span className="text-primary font-mono">{itemName}</span>
      </div>

      {isLoading && (
        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium px-0.5">
          <Loader2 className="h-2.5 w-2.5 animate-spin text-slate-400" /> Verifying constraints...
        </span>
      )}

      {error && (
        <span className="flex items-center gap-1 text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 max-w-max">
          <AlertCircle className="h-2.5 w-2.5 shrink-0" /> {error}
        </span>
      )}

      {!error && metrics && (
        <div className="flex items-center gap-x-2 gap-y-0.5 flex-wrap text-[10px] font-medium text-slate-500 bg-slate-50/80 px-1.5 py-0.5 rounded border border-slate-100 max-w-max">
          <span className="text-slate-700 font-bold">Metrics:</span>
          <span>Dem: <strong className="text-slate-900">{metrics.demand}</strong></span>
          <span>Fcst: <strong className="text-slate-900">{metrics.forecast}</strong></span>
          <span>Safety: <strong className="text-slate-900">{metrics.safety_stock}</strong></span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-0.5 rounded">Rec Qty: {metrics.recommended_qty}</span>
        </div>
      )}
    </div>
  );
}