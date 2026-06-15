import type { AllocationHeaderDetail } from '@/pages/allocations/AllocationDetailsPage';
import { Clock, ShieldAlert } from 'lucide-react';
import React from 'react';

export const AllocationStatusBarBanner: React.FC<{ header: AllocationHeaderDetail; isEditable: boolean }> = ({ header, isEditable }) => {
  const hoursLeft = Math.max(0, Math.floor(((new Date(header.createdAt).getTime() + 86400000) - Date.now()) / 3600000))

  if (!isEditable) {
    return (
      <div className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-600 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
        <div>
          <span className="font-bold">Operational Lock Active:</span> This parameter profile matrix is read-only. Allocation timelines exceeded 24 hours boundary limits.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-center justify-between gap-4 text-xs font-medium text-amber-800 shadow-2xs">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold">Pending Review Queue:</span> Actions can modify layout values until lock window closes.
        </div>
      </div>
      <span className="text-[10px] font-bold bg-amber-500 text-white font-mono px-2 py-0.5 rounded tracking-wide shrink-0">
        Expires in {hoursLeft} Hours
      </span>
    </div>
  )
}
