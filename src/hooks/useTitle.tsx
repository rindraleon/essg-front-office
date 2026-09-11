import { useEffect, useCallback } from 'react';

export const useTitle = (title?: string) => {
  const setTitle = useCallback((newTitle: string) => {
    document.title = `${newTitle} | ESSG`;
  }, []);

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [title, setTitle]);

  return { setTitle };
};
