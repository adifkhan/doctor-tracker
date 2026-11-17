import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<A extends unknown[]>(callback: (...args: A) => void, delay = 400) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(callback);

  useEffect(() => {
    latest.current = callback;
  });

  const cancel = useCallback(() => clearTimeout(timer.current), []);

  const debounced = useCallback(
    (...args: A) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => latest.current(...args), delay);
    },
    [delay]
  );

  useEffect(() => cancel, [cancel]);

  return { debounced, cancel };
}
