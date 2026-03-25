# DiploDocus

Un site de visualisation de données interactif dédié aux votes de l'Assemblée générale et du Conseil de sécurité des Nations Unies (1992–2025), développé au Science in Diplomacy Lab (SiDLab), Université de Genève / ETH Zurich.

## Aperçu

DiploDocus affiche les données de vote onusiennes sur une carte choroplèthe du monde et un tableau de bord latéral, permettant aux chercheurs et au grand public d'explorer la façon dont les États membres ont voté sur les résolutions, les années et les thèmes. Les utilisateurs peuvent filtrer par année (avec lecture animée), parcourir les résolutions individuelles ou restreindre les résultats à un domaine thématique. Trois modes de colorisation de la carte révèlent les schémas de vote selon la vue par défaut du taux de oui, la répartition d'alignement États-Unis–Chine, ou une comparaison bilatérale avec n'importe quel pays sélectionné. La vue Conseil de sécurité ajoute un graphique de dispersion d'alignement des P5 et un graphique en anneau de l'historique des vetos ventilé par membre permanent. Le texte intégral des résolutions est récupéré à la demande depuis un backend Supabase.

## Fonctionnalités

- **Carte choroplèthe du monde** — pays colorés par gradient de taux de oui (rouge → gris → vert) via MapLibre GL JS et le GeoJSON Natural Earth 110m
- **Trois modes de filtres** — Année, Thème et Résolution, permutables depuis la barre supérieure
- **Curseur d'année avec lecture animée** — défilement ou animation de 1992 à 2025 par pas de 800 ms
- **Navigateur de résolutions** — modal consultable listant toutes les résolutions AG ou CS ; triable par symbole, date ou controverse (nombre de non/abstentions) ; filtrable par année
- **Filtre thématique** — sélectionner un domaine thématique ONU pour agréger les votes sur toutes les résolutions correspondantes
- **Modes de colorisation de la carte** (AG uniquement) :
  - Par défaut : taux de oui par pays
  - États-Unis vs Chine : colorie les pays selon la superpuissance qu'ils ont soutenue lors des votes contestés
  - vs Pays : choisir n'importe quel pays et colorer tous les autres selon le taux d'accord de vote
- **Barre latérale de résumé des votes** — graphique à barres de la distribution des votes (mode résolution) ou quartiles de taux de oui (mode année/thème)
- **Panneau d'alignement P5** (CS) — axe de dispersion indiquant la position de chaque membre permanent sur un spectre Non–Abstention–Oui, avec un score d'alignement global et un modal de détail extensible
- **Panneaux d'alignement G20 et UE** (AG) — même axe de dispersion pour chaque bloc
- **Graphique en anneau des vetos** (CS) — anneau cliquable segmenté par membre P5, avec une liste de vetos par membre reliée aux archives ONU
- **Panneau contextuel de l'année** — titre de référence, récit et liens cliquables vers les résolutions clés pour chaque année
- **Panneau de contenu de résolution** — symbole, titre, étiquettes thématiques et un modal de texte intégral provenant de Supabase
- **Info-bulle pays** — survoler un pays pour voir ses statistiques de vote ou de taux de oui
- **Modal de sélection de pays** — rechercher et sélectionner parmi la liste complète des États membres pour le mode de comparaison bilatérale
- **Page À propos** — attribution du projet pour le SiDLab, l'Université de Genève et l'ETH Zurich

## Stack technique

| Couche | Technologie |
|---|---|
| Build | Vite 8 + TypeScript 5.9 (mode strict) |
| UI | React 19, Tailwind CSS 4 |
| Carte | MapLibre GL JS 5, react-map-gl 8 |
| État | Zustand 5 |
| Graphiques | Observable Plot 0.6, D3 7 |
| Backend | Supabase (texte intégral des résolutions) |
| Routage | React Router v7 |

## Prérequis

- Node.js 20 ou version ultérieure
- npm (ou pnpm / yarn)
- Un projet Supabase avec une table `resolution_content` (optionnel — la carte et le tableau de bord fonctionnent sans ; seul le panneau de texte intégral le nécessite)

## Installation

```bash
git clone <repo-url>
cd diplodocus
npm install
```

## Configuration

Créer un fichier `.env.local` à la racine du projet :

```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-supabase-anon-key>
```

Les deux variables sont optionnelles. Si elles sont omises, le client Supabase n'est pas initialisé et le texte intégral des résolutions est silencieusement ignoré — toutes les autres fonctionnalités restent opérationnelles.

| Variable | Obligatoire | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Non | URL REST du projet Supabase |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Non | Clé anon / publiable Supabase |

## Utilisation

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la compilation de production en local
npm run preview
```

Le serveur de développement démarre par défaut à `http://localhost:5173`.

## Structure du projet

```
diplodocus/
├── public/
│   ├── data/
│   │   ├── ga-resolutions.json        # 2 801 résolutions AG, 1992–2025
│   │   ├── sc-resolutions.json        # 2 093 résolutions CS, 1992–2025
│   │   ├── DPPA-SCVETOES.json         # Registres de vetos CS (source DPPA)
│   │   ├── geo/
│   │   │   └── countries.geojson      # Natural Earth 110m, indexé ISO_A3
│   │   └── aggregates/
│   │       ├── yearly-ga.json         # Proportions de votes annuelles par pays (AG)
│   │       ├── yearly-sc.json         # Proportions de votes annuelles par pays (CS)
│   │       └── topics.json            # Index Thème → ID de résolution
├── src/
│   ├── App.tsx                        # Racine du routeur (/ et /about)
│   ├── store/
│   │   └── filterStore.ts             # Store Zustand — tout l'état global des filtres
│   ├── lib/
│   │   ├── types.ts                   # Définitions de types canoniques
│   │   ├── colors.ts                  # VOTE_COLORS, NO_DATA_COLOR
│   │   ├── supabase.ts                # Client Supabase paresseux
│   │   ├── groupAlignment.ts          # Listes des membres G20 et UE + logique d'alignement
│   │   ├── p5alignment.ts             # Calcul de l'alignement P5
│   │   ├── yearSummaries.ts           # Récits contextuels annuels curatés
│   │   └── vetoSummaries.ts           # Descriptions de vetos curatées
│   ├── hooks/
│   │   ├── useVoteData.ts             # Hook de données principal — récupère, met en cache et colorie
│   │   ├── useVetoData.ts             # Hook de données de vetos CS
│   │   ├── useResolutionContent.ts    # Hook de texte intégral Supabase
│   │   └── useResolutionMeta.ts       # Hook de métadonnées de résolution
│   ├── components/
│   │   ├── Map/                       # VoteMap, MapLegend, MapModeBar,
│   │   │                              # CountryTooltip, CountryPickerModal
│   │   ├── Filters/                   # FilterBar, BodyToggle, YearSlider, TopicSelect
│   │   ├── Dashboard/                 # VoteSummary, P5AlignmentPanel, GroupAlignmentPanel,
│   │   │                              # VetoDonutPanel, YearContext, ResolutionContentPanel,
│   │   │                              # AlignmentModal, ResolutionFullTextModal, AllCountriesButton
│   │   ├── resolution/                # Modal ResolutionPicker, VetoList
│   │   ├── layout/                    # Header, Footer, DiploLogo
│   │   └── CountryFlag.tsx            # Images de drapeaux circulaires via CDN hatscripts
│   └── pages/
│       ├── VotesPage.tsx              # Vue principale (carte + barre latérale)
│       └── AboutPage.tsx              # Attribution du projet
```

## Développement

```bash
# Lancer le linter
npm run lint

# Vérification des types sans émission
npx tsc --noEmit
```

Le mode strict TypeScript est imposé. Les composants sont limités à 200 lignes — extraire des sous-composants en approchant de cette limite. Tous les types de données partagés doivent se trouver dans `src/lib/types.ts`. L'état global des filtres réside exclusivement dans `src/store/filterStore.ts`. Utiliser des composants fonctionnels avec des hooks partout.

## Données

Les données sources brutes ont été converties de CSV en JSON dans un script Python exécuté une seule fois (non inclus dans ce dépôt). Les fichiers JSON résultants sont versionnés dans `public/data/` et servis comme assets statiques — aucun traitement de données côté serveur ne se produit à l'exécution. Tous les chargements de données sont mis en cache dans des instances `Map` au niveau module afin d'éviter des requêtes réseau redondantes au cours d'une session.

Les valeurs de vote suivent la convention ONU : `Y` (oui), `N` (non), `A` (abstention), `X` (non-votant / absent).
