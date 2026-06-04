import { useState, useEffect } from "react";

/**
 * useDebounce
 * Returns a debounced version of the value after the specified delay.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 400);
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;