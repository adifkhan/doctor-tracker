import { useEffect } from 'react';
import type { PageMeta } from '@/types';

/** Moves back to the last valid page when the current one empties (e.g. after a delete). */
export function useClampPage(meta: PageMeta | undefined, page: number, setPage: (page: number) => void) {
  useEffect(() => {
    if (meta && page > 1 && page > meta.totalPages) setPage(Math.max(meta.totalPages, 1));
  }, [meta, page, setPage]);
}
