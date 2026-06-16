import { useState, useCallback } from 'react';
import type { DemandMetrics } from '../types';

interface UseDemandMetricsResult {
  demandMetrics: Record<number, DemandMetrics>;
  validationErrors: Record<number, string>;
  loadingMetrics: Record<number, boolean>;
  validateAndFetch: (
    lineId: number,
    organizationId: string,
    itemCode: string,
    billToCustomerId: string
  ) => Promise<void>;
}

export function useDemandMetrics(): UseDemandMetricsResult {
  const [demandMetrics, setDemandMetrics] = useState<Record<number, DemandMetrics>>({});
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const [loadingMetrics, setLoadingMetrics] = useState<Record<number, boolean>>({});

  const validateAndFetch = useCallback(
    async (
      lineId: number,
      organizationId: string,
      itemCode: string,
      billToCustomerId: string
    ) => {
      if (!billToCustomerId || !organizationId || !itemCode) {
        return;
      }

      setLoadingMetrics((prev) => ({ ...prev, [lineId]: true }));
      setValidationErrors((prev) => ({ ...prev, [lineId]: '' }));

      try {
        await new Promise((resolve) => setTimeout(resolve, 400));

        const isValidCategory = Math.random() > 0.1;

        if (!isValidCategory) {
          setValidationErrors((prev) => ({
            ...prev,
            [lineId]: 'Cannot create this item as per validation rules (RRS category mismatch)',
          }));
          setLoadingMetrics((prev) => ({ ...prev, [lineId]: false }));
          return;
        }

        const mockMetrics: DemandMetrics = {
          demand: Math.floor(Math.random() * 1000) + 100,
          forecast: Math.floor(Math.random() * 500) + 50,
          safety_stock: Math.floor(Math.random() * 200) + 10,
          recommended_qty: Math.floor(Math.random() * 800) + 100,
        };

        setDemandMetrics((prev) => ({ ...prev, [lineId]: mockMetrics }));
      } catch {
        setValidationErrors((prev) => ({
          ...prev,
          [lineId]: 'Error fetching demand metrics. Please try again.',
        }));
      } finally {
        setLoadingMetrics((prev) => ({ ...prev, [lineId]: false }));
      }
    },
    []
  );

  return { demandMetrics, validationErrors, loadingMetrics, validateAndFetch };
}