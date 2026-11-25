# IDA RESILIENCE PHARMA — Cahier des charges fonctionnel

Version 1.0 — 25 novembre 2026. Base de travail à valider avec une pharmacie pilote.

## 1. Objectif
Outil de gestion destiné aux pharmacies qui doivent continuer leurs opérations essentielles même sans connexion Internet. Le fonctionnement local est prioritaire ; Internet sert aux sauvegardes distantes et à la synchronisation lorsqu'il revient.

## 2. Périmètre V1
- Catalogue : nom, code interne/code-barres, catégorie, unité, prix d'achat et de vente, seuil d'alerte.
- Lots : numéro, quantité, péremption, fournisseur et coût d'achat.
- Stock : entrées, sorties, ajustements justifiés, inventaires et historique.
- Vente/comptoir : recherche, panier, remise autorisée, règlement, reçu et annulation contrôlée.
- Application FEFO (lot expirant le plus tôt utilisé en premier) et alerte sur les lots expirés.
- Fournisseurs et approvisionnements : réception et mise à jour des lots.
- Caisse : ouverture/fermeture, entrées/sorties et rapprochement.
- Utilisateurs et rôles : administrateur, responsable, vendeur/caissier, magasinier.
- Rapports : ventes, marges estimées, mouvements, stock, péremptions et caisse.
- Sauvegarde locale exportable et restauration contrôlée.
- Journal d'audit des actions sensibles.

## 3. Fonctionnement hors connexion
Authentification locale, catalogue, ventes, mouvements de stock, caisse, historique et reçus doivent rester disponibles sans Internet. Une coupure ne doit ni bloquer une vente ni faire perdre une opération validée.

## 4. Plusieurs appareils
Deux modes : autonome sur un appareil ; ou mode pharmacie avec ordinateur/mini-serveur sur Wi-Fi/Ethernet local. Le mode multi-appareils est activé et testé séparément. Si le serveur local est inaccessible, un terminal ne doit pas prétendre avoir enregistré une opération partagée.

## 5. Règles métier
- Stock négatif interdit par défaut.
- Lot expiré bloqué à la vente par défaut.
- Chaque mouvement comporte origine, auteur, date et motif.
- Identifiant unique par vente ; prévention des doubles validations.
- Une annulation crée une opération compensatoire, sans effacer l'historique.
- Paiement mobile noté manuellement hors ligne ; vérification opérateur seulement avec connexion et intégration autorisée.
- Marges affichées = estimations fondées sur les coûts saisis.

## 6. Hors périmètre V1
Dossier patient, historique clinique, diagnostic ou recommandation thérapeutique ; vérification des paiements opérateurs sans Internet ; cloud obligatoire ; intégrations réglementaires non validées ; promesse de conformité avant audit compétent.

## 7. Sécurité
Comptes individuels, permissions par rôle, verrouillage automatique, journal d'audit, sauvegardes chiffrées lorsque cette capacité est intégrée et testée, récupération d'accès documentée, collecte minimale de données.

## 8. Critères d'acceptation
1. Installation propre utilisable sans Internet.
2. Données validées présentes après redémarrage.
3. Au moins 100 ventes de test hors ligne sans perte ni doublon.
4. FEFO correct et lots expirés bloqués.
5. Annulations et corrections traçables.
6. Sauvegarde exportable puis restaurable sur une installation de test.
7. Permissions par rôle vérifiées.
8. Coupures et redémarrages pendant une opération testés.
9. Rapports conformes aux transactions.
10. Limites des modes autonome et réseau local documentées.

## 9. Validation terrain
Observer une pharmacie pilote : vente, réception, inventaire, clôture de caisse, matériel, nombre d'utilisateurs et interruptions. Faire valider les écrans et règles métier par le responsable.
