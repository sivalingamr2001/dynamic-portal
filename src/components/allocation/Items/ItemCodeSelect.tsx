import Select from 'react-select';
import { SELECT_STYLES } from './constants';

interface ItemCodeSelectProps {
  value: string;
  options: any[];
  isLoading: boolean;
  isDisabled: boolean;
  onSearch: (searchTerm: string) => void;
  onChange: (option: any) => void;
}

export function ItemCodeSelect({
  value,
  options,
  isLoading,
  isDisabled,
  onSearch,
  onChange,
}: ItemCodeSelectProps) {
  const selectedOption = options.find((o) => o.value === value) ||
    (value ? { value, label: value } : null);

  const formatOptionLabel = (option: any) => {
    const itemCode = option.value || option.itemCode || 'N/A';

    return (
      <div className="flex flex-col gap-0.5 py-0.5 text-[11px] leading-tight text-left">
        <div className="flex items-center justify-between font-semibold text-slate-800 gap-4">
          <span className="text-primary font-mono">{itemCode}</span>
        </div>
      </div>
    );
  };

  return (
    <Select
      options={options}
      onInputChange={onSearch}
      onChange={onChange}
      value={selectedOption}
      placeholder="Search code..."
      isLoading={isLoading}
      isClearable
      styles={SELECT_STYLES}
      isDisabled={isDisabled}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      menuPosition="fixed"
      formatOptionLabel={formatOptionLabel}
    />
  );
}