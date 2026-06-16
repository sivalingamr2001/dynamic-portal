import { Input } from '@/components/ui/input';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateInput({ value, onChange }: DateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="date"
      value={value}
      onChange={handleChange}
      className="h-6 px-1.5 text-xs border-slate-200 focus-visible:ring-1 text-slate-600"
    />
  );
}