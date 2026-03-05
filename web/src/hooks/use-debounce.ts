import { useCallback, useEffect, useRef, useState } from 'react';

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedCallback = <TArgs extends Array<unknown>>(
  callback: (...args: TArgs) => void,
  delay = 500,
) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callbackRef, callback]);

  return useCallback(
    (...args: TArgs) => {
      clearTimeout(timeoutRef.current ?? undefined);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );
};
