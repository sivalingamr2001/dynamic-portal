import { Plus } from 'lucide-react';

interface AddLineButtonProps {
  onAdd: () => void;
}

export function AddLineButton({ onAdd }: AddLineButtonProps) {
  return (
    <div className="flex justify-start">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-6 items-center gap-1 rounded border border-dashed border-slate-300 bg-white px-2.5 text-[10px] font-bold text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors"
      >
        <Plus className="h-3 w-3" /> Add Item Line
      </button>
    </div>
  );
}