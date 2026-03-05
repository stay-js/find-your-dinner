import { useEffect, useState } from 'react';

export function useDebouncedLoading(isLoading: boolean, delay = 300) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => setShowLoading(true), delay);

    return () => {
      clearTimeout(timeout);
      setShowLoading(false);
    };
  }, [isLoading, delay]);

  return showLoading;
}
