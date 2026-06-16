import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ItemOperatingUnitDto } from './types';

interface OrgSelectProps {
  value: string;
  options: ItemOperatingUnitDto[] | undefined;
  isDisabled: boolean;
  onChange: (organizationId: number, organizationCode: string) => void;
}

export function OrgSelect({ value, options, isDisabled, onChange }: OrgSelectProps) {
  const handleValueChange = (selectedValueStr: string) => {
    const matchedOu = options?.find(
      (ou) => ou.organizationId.toString() === selectedValueStr
    );

    if (matchedOu) {
      onChange(matchedOu.organizationId, matchedOu.organizationCode);
    } else {
      onChange(0, '');
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={isDisabled}>
      <SelectTrigger className="h-[26px] w-full border-slate-200 bg-white px-2 py-0 text-xs font-medium text-slate-700 shadow-none outline-none focus:ring-0 focus:border-slate-400 gap-0 rounded [&>svg]:hidden justify-start">
        <SelectValue placeholder="Select Org..." />
      </SelectTrigger>

      <SelectContent className="text-xs min-w-[var(--radix-select-trigger-width)] max-h-[200px] bg-background text-foreground z-50">
        {options?.map((ou) => (
          <SelectItem
            key={ou.organizationId}
            value={ou.organizationId.toString()}
            className="text-xs py-1 px-2 font-medium cursor-pointer"
          >
            {ou.organizationCode}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}