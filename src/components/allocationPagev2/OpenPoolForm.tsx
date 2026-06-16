'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OpenPoolFormProps {
  remarks: string;
  onChange: (remarks: string) => void;
}

export default function OpenPoolForm({ remarks, onChange }: OpenPoolFormProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          This allocation is for an open pool. Items will be available for all
          eligible customers.
        </p>
      </div>

      <div>
        <Label htmlFor="poolRemarks" className="mb-2 block text-sm font-medium">
          Remarks
        </Label>
        <Textarea
          id="poolRemarks"
          value={remarks}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add remarks for this allocation"
          className="resize-none"
          rows={4}
        />
      </div>
    </div>
  );
}
