# IDA RESILIENCE PHARMA

Application de gestion de pharmacie conçue selon une approche offline-first.

## Démarrer la V0.1

Le prototype est une application web installable (PWA) :
1. Servir le dossier à partir d'un serveur HTTP/HTTPS statique.
2. Ouvrir l'adresse dans un navigateur compatible avec IndexedDB et les service workers.
3. Ajouter l'application à l'écran d'accueil si le navigateur le propose.
4. Créer des produits, enregistrer les lots reçus, puis effectuer des ventes de test.
5. Exporter régulièrement une sauvegarde JSON depuis le menu « Sauvegarde ».

Pour tester localement sur un ordinateur, un serveur statique peut servir le dossier (par exemple `python -m http.server 8000`), puis ouvrir `http://localhost:8000`.

## Fonctions présentes

- Catalogue de produits et seuils d'alerte.
- Lots avec numéro, quantité, date de péremption, coût et fournisseur.
- Calcul du stock à partir des lots.
- Alertes de péremption.
- Panier et validation des ventes.
- Sortie FEFO sur les lots non expirés.
- Historique des ventes et journal d'audit local.
- Export et restauration d'une sauvegarde JSON.
- Cache de l'interface pour réouverture hors connexion après le premier chargement.

## Limites importantes

Cette V0.1 est un prototype de validation fonctionnelle, pas un logiciel prêt à être utilisé comme système principal d'une pharmacie. Elle ne comprend pas encore :
- comptes utilisateurs, authentification et permissions ;
- chiffrement des données et des sauvegardes ;
- serveur local multi-postes et synchronisation entre appareils ;
- APK Android signée et processus de mise à jour ;
- impression de tickets, lecture code-barres et intégrations externes ;
- audit de sécurité, tests de charge et validation réglementaire.

Les données restent dans le stockage du navigateur sur l'appareil. Effacer les données du navigateur peut les supprimer. La sauvegarde JSON n'est pas chiffrée. Ne pas y importer de données personnelles de patients. Tester uniquement avec des données fictives jusqu'à validation complète.

## Documents du projet

- [Cahier des charges](docs/01-cahier-des-charges.md)
- [Architecture technique](docs/02-architecture-technique.md)
- [Plan de réalisation](docs/03-plan-de-livraison.md)

## Prochaines étapes de développement

1. Tests automatisés des règles de stock, FEFO et ventes.
2. Migration vers SQLite pour l'application Android avec Capacitor.
3. Authentification locale et permissions.
4. Gestion complète des réceptions, inventaires et mouvements.
5. Mode serveur local multi-appareils.
6. Sauvegarde chiffrée et restauration vérifiée.
7. Pilote supervisé dans une pharmacie.
