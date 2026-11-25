# IDA RESILIENCE PHARMA — Architecture technique

Version 1.0 — 25 novembre 2026. Principe : le cœur fonctionne localement ; le cloud est facultatif.

## 1. Architecture cible
- Client : React + TypeScript ; Capacitor pour Android ; interface web/PWA pour postes compatibles.
- Android : SQLite pour le stockage durable. IndexedDB peut servir au prototype web, pas remplacer la base de production Android.
- Mode autonome : application + base SQLite locale, transactions atomiques et sauvegarde/restauration.
- Mode réseau local : mini-PC/ordinateur hébergeant API locale et base PostgreSQL (ou SQLite si le déploiement mono-serveur le justifie), accessible par Wi-Fi/Ethernet sans Internet.
- Services distants facultatifs : synchronisation chiffrée quand la connexion revient. Supabase peut être étudié pour les services distants, mais ne doit pas être requis pour le fonctionnement local. Vercel peut héberger un portail, pas le moteur local indispensable aux ventes.

## 2. Couches logiques
- domain : règles métier, FEFO, stock et caisse.
- application : cas d'utilisation et orchestration transactionnelle.
- infrastructure : SQLite, API locale, sauvegardes et synchronisation.
- ui : écrans et composants React.
- shared : types, validation, identifiants et contrats API.
Les règles métier ne dépendent pas de React ni d'un fournisseur cloud.

## 3. Données principales
users, roles, permissions, products, categories, barcodes, suppliers, purchases, purchase_items, lots, sales, sale_items, payments, stock_movements, cash_sessions, cash_movements, audit_events, devices, sync_outbox et sync_cursors.
Les montants sont stockés en entiers FCFA, jamais en flottants binaires. Dates et fuseaux doivent être explicites.

## 4. Cohérence
Chaque vente est une transaction atomique : contrôle du stock, allocation FEFO, vente, mouvements, paiement et audit. Identifiants uniques locaux, contraintes d'unicité, clés étrangères et idempotence. Les corrections sont des événements compensatoires, pas des effacements silencieux.

## 5. Synchronisation future
À développer après stabilisation du mode local. Chaque appareil possède un identifiant et une file d'événements sortants avec identifiant global, date, auteur, appareil et version de schéma. Prévoir reprise après coupure, accusés idempotents, détection/résolution explicite des conflits, journal consultable. Ne pas appliquer « dernier écrit gagnant » aux stocks ou à la caisse.

## 6. Sécurité
Hachage robuste des mots de passe, permissions vérifiées dans la couche métier et côté API, chiffrement des sauvegardes et communications locales lorsque possible, sessions limitées, verrouillage automatique, audit, mises à jour signées à concevoir, tests de restauration et d'intégrité.

## 7. Déploiement
Installation Android signée, version web/PWA, assistant de configuration, sauvegarde sur support distinct, diagnostic exportable sans données sensibles inutiles, documentation des mises à jour et migrations.

## 8. Décisions à valider
Matériel des pharmacies pilotes, nombre d'appareils et utilisateurs simultanés, SQLite ou PostgreSQL pour serveur local, imprimante/lecteur code-barres, politique de sauvegarde/chiffrement et cadre légal applicable au Mali à faire valider par des professionnels compétents.
