"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

type RawPatch = Record<string, string | number | undefined>;

export function useUrlFilters<K extends string>(keys: readonly K[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const entries = keys.map(
      (key) => [key, searchParams.get(key) ?? ""] as const,
    );
    return Object.fromEntries(entries) as Record<K, string>;
  }, [keys, searchParams]);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
  const activeCount = keys.filter((key) => filters[key]).length;

  const apply = useCallback(
    (patch: RawPatch) => {
      const next = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (
          value === undefined ||
          value === "" ||
          (key === "page" && value === 1)
        )
          next.delete(key);
        else next.set(key, String(value));
      }
      if (!("page" in patch)) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const update = useCallback(
    (patch: Partial<Record<K, string>>) => apply(patch),
    [apply],
  );
  const setPage = useCallback(
    (value: number) => apply({ page: value }),
    [apply],
  );
  const setLimit = useCallback(
    (value: number) => apply({ limit: value }),
    [apply],
  );

  const reset = useCallback(() => {
    const next = new URLSearchParams(window.location.search);
    for (const key of keys) next.delete(key);
    next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [keys, pathname, router]);

  return {
    filters,
    page,
    limit,
    activeCount,
    update,
    setPage,
    setLimit,
    reset,
  };
}
