export const TABLE_HEADERS = [
  { label: '#', width: 'w-8' },
  { label: 'Org', width: 'w-28' },
  { label: 'Item Code', width: 'w-40' },
  { label: 'Description', width: '' },
  { label: 'Weeks', width: 'w-28' },
  { label: 'PEND Qty (BIN)', width: 'w-20' },
  { label: 'RSV Qty (BIN)', width: 'w-20' },
  { label: 'PICKED Qty (BIN)', width: 'w-20' },
  { label: 'BIN Qty (BIN)', width: 'w-20' },
  { label: 'BIN RSV Qty (BIN)', width: 'w-20' },
  { label: 'Qty (BIN)', width: 'w-20' },
  { label: 'Qty (BIN)', width: 'w-20' },
  { label: 'Target Date', width: 'w-28' },
  { label: 'Action', width: 'w-8' },
];

export const SELECT_STYLES = {
  control: (base: any) => ({
    ...base,
    minHeight: '26px',
    height: '26px',
    fontSize: '11px',
    borderRadius: '4px',
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    '&:hover': { borderColor: '#cbd5e1' },
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '0 6px',
    height: '26px',
  }),
  input: (base: any) => ({
    ...base,
    margin: '0px',
    padding: '0px',
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '26px',
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: '2px',
  }),
  clearIndicator: (base: any) => ({
    ...base,
    padding: '2px',
  }),
  menu: (base: any) => ({
    ...base,
    fontSize: '11px',
    zIndex: 1000,
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 1000,
  }),
};