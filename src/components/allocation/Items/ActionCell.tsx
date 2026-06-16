import { Trash2 } from 'lucide-react';

interface ActionCellProps {
  isDisabled: boolean;
  onRemove: () => void;
}

export function ActionCell({ isDisabled, onRemove }: ActionCellProps) {
  return (
    <div className="p-1 text-center">
      <button
        type="button"
        onClick={onRemove}
        disabled={isDisabled}
        className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}