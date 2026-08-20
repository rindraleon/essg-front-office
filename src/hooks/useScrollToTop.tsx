import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remontée en haut de page à chaque navigation (§11, §12).
 *
 * Monté une seule fois, dans `Layout` : il couvre donc toutes les
 * navigations — menu principal, cartes, CTA, fil d'Ariane, liens internes et
 * pages de détail — sans qu'aucune page n'ait à s'en préoccuper.
 *
 * Deux choix qui méritent explication :
 *
 *  - **`behavior: 'auto'` et non `'smooth'`.** Un défilement animé depuis le
 *    bas d'une longue page prend plus d'une seconde, pendant laquelle la
 *    nouvelle page défile sous les yeux de l'utilisateur alors qu'il a déjà
 *    changé de contexte. C'est perçu comme une lenteur, pas comme une
 *    fluidité. Le §12 demande explicitement un scroll top rapide ; la
 *    sensation de fluidité vient de la transition d'entrée du contenu,
 *    gérée par `Layout`.
 *
 *  - **Le premier rendu est ignoré.** Au chargement initial, le navigateur
 *    restaure lui-même la position (ancre, retour arrière, rechargement) ;
 *    écraser ce comportement ferait perdre sa place à l'utilisateur qui
 *    revient en arrière.
 */
const useScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Ancre explicite : c'est elle qui décide de la position, pas nous.
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);
};

export default useScrollToTop;
