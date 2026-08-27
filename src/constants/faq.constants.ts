import type { FaqItem } from '@/types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quelles sont les conditions d'admission à l'ESSG ?",
    reponse:
      "L'admission à l'ESSG se fait sur dossier et entretien. Les candidats doivent être titulaires d'un baccalauréat scientifique ou équivalent pour la licence. Pour le master, une licence en géomatique ou domaine connexe est requise.",
  },
  {
    question: 'Quelle est la durée des formations ?',
    reponse:
      'La licence dure 3 ans (6 semestres), le master dure 2 ans (4 semestres). Des formations continues et certifiantes de courte durée sont également proposées.',
  },
  {
    question: "L'ESSG propose-t-elle des bourses ?",
    reponse:
      "Oui, l'ESSG dispose de bourses d'excellence et de bourses sociales. Les étudiants peuvent également bénéficier de bourses de nos partenaires internationaux.",
  },
  {
    question: "Quels sont les débouchés après une formation à l'ESSG ?",
    reponse:
      "Les diplômés de l'ESSG travaillent dans divers secteurs : cartographie, télédétection, SIG, aménagement du territoire, environnement, urbanisme, agriculture de précision, etc. Le taux d'insertion professionnelle est de 95%.",
  },
  {
    question: "L'ESSG propose-t-elle des stages ?",
    reponse:
      "Oui, chaque formation inclut des périodes de stage obligatoires en entreprise ou en laboratoire de recherche. L'ESSG dispose d'un réseau de partenaires nationaux et internationaux pour faciliter les stages.",
  },
  {
    question: "Comment contacter l'ESSG ?",
    reponse:
      'Vous pouvez nous contacter par email à contact@essg.mg, par téléphone au +261 34 28 085 30, ou en vous rendant directement à notre campus situé à Andrainjato, Fianarantsoa.',
  },
];

export const HOME_FAQ_ITEMS: FaqItem[] = FAQ_ITEMS.slice(0, 4);
