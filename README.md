# Frontend public ESSG

Site vitrine public (React + TypeScript + Vite + Tailwind CSS + React Router + TanStack Query).
Consomme l'API NestJS `backend-essg` en lecture publique (formations, projets, actualités, partenaires, RH, admissions).

## ⚡ Commandes importantes

```bash
npm install        # installer les dépendances
npm run dev        # développement (port 5173 par défaut, HMR)
npm run build      # typecheck (tsc -b) + build production → dist/
npm run preview    # prévisualiser le build
npm run lint       # ESLint avec correction automatique
npm run lint:sonar # ESLint sans correction (qualimétrie)
```

## 🔧 Variables d'environnement

Copier `.env.example` → `.env` :

```bash
VITE_PORT=5173                          # port du dev server
VITE_API_BASE_URL=http://localhost:3000 # URL de l'API NestJS
```

## 🗒 Notes

- Aucune authentification ici : les routes publiques de l'API sont ouvertes en lecture ; le formulaire d'admission POST vers `/admissions`.
- L'admin se fait dans **`../back-office`** (compte requis, sessions 15 min).
- `node_modules` n'est pas persisté dans ce workspace : relancer `npm install` après une restauration.
- Audit UI/UX et rapports : voir `../AUDIT-UI-UX-QA.md` et `../RAPPORT-VOLET3-SESSIONS.md`.
