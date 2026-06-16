import { Input } from '@/components/ui/input';

interface QuantityInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuantityInput({ value, onChange }: QuantityInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      placeholder="0"
      min="0"
      className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
    />
  );
}