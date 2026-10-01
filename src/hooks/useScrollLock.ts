import { useEffect } from 'react';

/**
 * Verrouillage de défilement partagé (menu mobile du Header, visionneuse).
 *
 * Référence de verrouillage : deux surfaces peuvent être ouvertes en même
 * temps (par exemple le menu mobile puis la visionneuse) ; chacune incrémente
 * le compteur et le document n'est restauré qu'au dernier déverrouillage.
 *
 * La largeur de la barre de défilement est compensée par un `padding-right`
 * sur `<body>` : sans cela, la disparition de la barre décale horizontalement
 * toute la mise en page (layout shift) à l'ouverture du menu.
 */

let lockCount = 0;
let restore: (() => void) | null = null;

const applyScrollbarWidth = () => {
  const { documentElement } = document;
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
  document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
};

const acquire = () => {
  lockCount += 1;
  if (lockCount > 1) return;

  const { body, documentElement } = document;
  const snapshot = {
    bodyOverflow: body.style.overflow,
    htmlOverflow: documentElement.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
  };

  body.style.overflow = 'hidden';
  documentElement.style.overflow = 'hidden';
  applyScrollbarWidth();

  // La compensation doit suivre la rotation de l'appareil : la barre de
  // défilement peut apparaître ou disparaître pendant le verrouillage.
  const handleResize = () => applyScrollbarWidth();
  window.addEventListener('resize', handleResize);

  restore = () => {
    window.removeEventListener('resize', handleResize);
    body.style.overflow = snapshot.bodyOverflow;
    documentElement.style.overflow = snapshot.htmlOverflow;
    body.style.paddingRight = snapshot.bodyPaddingRight;
    restore = null;
  };
};

const release = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) restore?.();
};

const useScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) return;
    acquire();
    return release;
  }, [locked]);
};

export default useScrollLock;
