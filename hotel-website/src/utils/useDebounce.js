import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Hủy bỏ timeout trước đó nếu giá trị thay đổi
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
