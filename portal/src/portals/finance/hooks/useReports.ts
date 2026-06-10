// src/portals/finance/hooks/useReports.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@api/queryKeys";
import { financeService } from "../services/financeService";

export const useReports = () =>
  useQuery({
    queryKey: queryKeys.finance.reports(),
    queryFn: financeService.getReports,
    staleTime: 1000 * 60 * 10,
  });
