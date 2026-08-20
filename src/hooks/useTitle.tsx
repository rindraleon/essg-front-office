// src/hooks/useTitle.tsx

import { useEffect, useCallback } from 'react';

export const useTitle = (title?: string) => {
  const setTitle = useCallback((newTitle: string) => {
    document.title = `${newTitle} - Template ITDC Mada`;
  }, []);

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [title, setTitle]);

  return { setTitle };
};
