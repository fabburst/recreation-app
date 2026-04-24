# 🎬 Récréation

Application web de suivi de films, séries, jeux vidéo et livres.

## Démo rapide

Ouvre `Recreation.html` dans un navigateur — aucun build nécessaire.

## Déploiement Vercel

1. Connecte ce repo à Vercel (vercel.com/new)
2. Laisse tout par défaut (pas de framework, pas de build command)
3. ✅ Déployé !

## Clés API (optionnel — pour les vraies couvertures)

Dans l'app, ouvre le panneau **Tweaks** (bas droite) :

| Clé | Source | Gratuit |
|-----|--------|---------|
| TMDB | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) | ✅ |
| RAWG | [rawg.io/apidocs](https://rawg.io/apidocs) | ✅ |

Les couvertures **Open Library (livres)** fonctionnent sans clé.

## Stack

- HTML + React 18 (Babel standalone, CDN)
- localStorage pour la persistance
- API TMDB / RAWG / Open Library pour les couvertures
