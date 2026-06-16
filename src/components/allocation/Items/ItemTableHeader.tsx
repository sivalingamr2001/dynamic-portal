import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TABLE_HEADERS } from './constants';

export function ItemTableHeader() {
  return (
    <TableHeader className="bg-slate-50/90 sticky top-0 z-10 border-b border-slate-200 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
      <TableRow className="h-7">
        {TABLE_HEADERS.map((header) => (
          <TableHead
            key={header.label}
            className={`h-7 px-2 text-[10px] font-bold uppercase text-slate-500 ${header.width}`}
          >
            {header.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}