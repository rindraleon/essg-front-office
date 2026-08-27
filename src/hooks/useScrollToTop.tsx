import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);
};

export default useScrollToTop;
