import { useRef, useEffect } from "react";

export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      callback(...args);
      debounceTimeout.current = null;
    }, delay);
  };
}