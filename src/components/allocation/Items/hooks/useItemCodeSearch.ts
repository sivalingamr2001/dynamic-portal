import { useState, useCallback } from 'react';

interface UseItemCodeSearchResult {
  internalOptions: any[];
  isLoadingInternal: boolean;
  handleSearch: (searchTerm: string) => void;
}

export function useItemCodeSearch(
  externalSearch?: (searchTerm: string) => void
): UseItemCodeSearchResult {
  const [internalOptions, setInternalOptions] = useState<any[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (externalSearch) {
        externalSearch(searchTerm);
        return;
      }

      if (searchTerm.length < 2) {
        setInternalOptions([]);
        return;
      }

      setIsLoadingInternal(true);
      setIsLoadingInternal(false);
    },
    [externalSearch]
  );

  return { internalOptions, isLoadingInternal, handleSearch };
}