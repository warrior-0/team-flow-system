import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, normalize: (value: T) => T = (value) => value) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return normalize(stored ? (JSON.parse(stored) as T) : initialValue);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
