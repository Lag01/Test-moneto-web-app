# Moneto - Application de Gestion Financière

Application web moderne de gestion financière personnelle construite avec Next.js, TypeScript, et Tailwind CSS.

## 🚀 Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Zustand** - Gestion d'état légère et performante
- **localforage** - Stockage persistant avec IndexedDB
- **Recharts** - Bibliothèque de graphiques React
- **d3-sankey** - Diagrammes de flux Sankey
- **dayjs** - Manipulation de dates légère

## 📁 Structure du projet

```
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux + Tailwind
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et helpers
│   ├── storage.ts        # Gestion du stockage avec localforage
│   ├── financial.ts      # Fonctions de calculs financiers
│   └── utils.ts          # Utilitaires généraux
├── store/                 # Store Zustand
│   └── index.ts          # Store principal avec persistance
├── tailwind.config.ts     # Configuration Tailwind CSS
├── tsconfig.json          # Configuration TypeScript
├── next.config.ts         # Configuration Next.js
└── eslint.config.mjs      # Configuration ESLint
```

## 🛠️ Installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Lancer le serveur de développement** :
```bash
npm run dev
```

3. **Ouvrir le navigateur** :
Aller sur [http://localhost:3000](http://localhost:3000)

## 📝 Scripts disponibles

```bash
npm run dev      # Lance le serveur de développement
npm run build    # Compile l'application pour la production
npm run start    # Lance le serveur de production
npm run lint     # Vérifie le code avec ESLint
```

## 🏗️ Fonctionnalités principales

### Store Zustand avec persistance

Le store (`store/index.ts`) gère :
- **Transactions** : ajout, modification, suppression
- **Catégories** : gestion des catégories de revenus et dépenses
- **Budget mensuel** : définition et suivi
- **Persistance automatique** : sauvegarde dans IndexedDB via localforage

### Utilitaires financiers

Le fichier `lib/financial.ts` fournit :
- Formatage de montants en euros
- Calculs de totaux, moyennes, pourcentages
- Gestion des dates et périodes (mois, semaine, année)
- Calcul de soldes et balances

### Stockage persistant

Le service `lib/storage.ts` offre :
- Interface simplifiée pour localforage
- Méthodes CRUD typées
- Gestion d'erreurs intégrée

## 🎨 Configuration Tailwind CSS

Tailwind est configuré avec :
- Support du mode sombre (dark mode)
- Variables CSS personnalisées
- Classes utilitaires étendues

## 📦 Dépendances principales

| Package | Version | Usage |
|---------|---------|-------|
| next | ^15.5.4 | Framework React |
| react | ^19.1.1 | Bibliothèque UI |
| typescript | ^5.9.2 | Typage statique |
| zustand | ^5.0.8 | Gestion d'état |
| localforage | ^1.10.0 | Stockage IndexedDB |
| recharts | ^3.2.1 | Graphiques |
| d3-sankey | ^0.12.3 | Diagrammes Sankey |
| dayjs | ^1.11.18 | Manipulation de dates |
| tailwindcss | ^4.1.13 | Framework CSS |

## 🔧 Configuration TypeScript

Le projet utilise une configuration TypeScript stricte avec :
- Mode strict activé
- Alias de chemins (`@/*` pointe vers la racine)
- Support des plugins Next.js
- Cible ES2020

## 📄 License

ISC
