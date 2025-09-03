import { useRef, useEffect } from 'react';

export function useAutoSave(
  data: any,
  onSave: (draft: any) => void,
  delay = 1500
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSave({ ...data, draft: true });
    }, delay);
    return () => timer.current && clearTimeout(timer.current);
  }, [data, onSave, delay]);
}
