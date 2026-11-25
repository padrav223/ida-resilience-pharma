# IDA RESILIENCE PHARMA — Plan de réalisation

Version 1.0 — 25 novembre 2026.

## Phase 0 — Validation terrain
Rencontrer une pharmacie pilote, cartographier vente/réception/inventaire/caisse, relever matériel et réseau, valider vocabulaire, rôles et écrans. Livrable : parcours métier validé.

## Phase 1 — Socle offline
Créer React/TypeScript, couche métier, SQLite et migrations ; authentification locale, rôles, audit, sauvegarde/restauration. Tester redémarrage, coupure, intégrité et restauration. Livrable : application conservant ses données sans Internet.

## Phase 2 — Catalogue et stock
Produits, catégories, codes-barres, fournisseurs, réceptions, lots, péremptions, alertes, mouvements, inventaires et FEFO. Livrable : stock traçable hors ligne.

## Phase 3 — Vente et caisse
Panier, validation, reçu, historique, paiements saisis manuellement, ouverture/fermeture de caisse, annulations traçables et rapports journaliers. Livrable : vente complète hors ligne.

## Phase 4 — Robustesse
Tests prolongés sans Internet, coupures pendant transactions, redémarrage, batterie faible, restauration sur autre appareil, permissions et correction des anomalies bloquantes. Livrable : rapport de tests et version candidate pilote.

## Phase 5 — Pilote
Installation contrôlée, formation, comparaison avec procédures existantes, collecte d'incidents. Conserver les procédures de secours au début. Livrable : bilan et décision de déploiement.

## Phase 6 — Multi-appareils local
Déployer API et base sur ordinateur local, connecter plusieurs terminaux Wi-Fi/Ethernet, tester simultanéité, coupures LAN et sauvegardes. Livrable : mode multi-postes sans Internet.

## Phase 7 — Synchronisation distante facultative
Définir conflits, file d'événements, reprise et idempotence ; tester reconnexion. Livrable : sauvegarde/synchronisation distante optionnelle.

## Conditions de sortie du pilote
Aucune perte de transaction dans les scénarios testés, aucune vente dupliquée après reprise, stock et caisse réconciliables, restauration démontrée, utilisateurs autonomes sans Internet et procédures de secours comprises.

## Règle de livraison
Ne pas annoncer « prêt pour les pharmacies » sur la seule base d'une maquette. Chaque phase doit être démontrée, testée et validée.
