import { useState, useEffect } from 'react';

// Hook personalizado para retrasar la actualización de un valor
// Útil para evitar muchas llamadas a la API mientras el usuario escribe en un buscador
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
