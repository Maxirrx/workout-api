# Repères pour travailler sur workout-api

Ce document décrit les conventions observées et les préférences exprimées pour ce projet. Il sert de référence modifiable pour les prochaines interventions. Les instructions explicites du propriétaire et les conventions du code concerné restent prioritaires.

## Projet et organisation

API de suivi d'entraînement en TypeScript, avec Express, PostgreSQL (`pg`) et injection de dépendances par `tsyringe`. Le projet distingue domaine, ports et infrastructure.

- `src/Domain/Entity` contient les entités métier et leurs fakers.
- `src/Domain/Port/Out/Repository` et `Service` contiennent les contrats, nommés `I...Repository` et `I...Service`.
- `src/Domain/Service` contient les services métier, dont les fichiers portent généralement le préfixe `D`.
- `src/Infra/Repository` contient les requêtes PostgreSQL et la reconstruction des entités.
- `src/Infra/Service` contient les services qui orchestrent les appels aux services métier et repositories.
- `src/Infra/Http/Controller` et `Route` contiennent les contrôleurs Express et les routes, réparties entre `app` et `wm`, puis versionnées.
- `src/Infra/Config` contient la connexion à la base et l'enregistrement des dépendances.
- `src/Data/Sql/Migration` et `Fixtures` contiennent le schéma et les données de test. `src/Utils` contient notamment `ApiError` et le traitement des erreurs.
- `src/test` reprend l'organisation domaine et infrastructure. Certains fichiers de services, repositories et contrôleurs sont encore vides.

## Manière de procéder

Lire les fichiers voisins et suivre leur écriture avant de modifier ou créer du code. Limiter les modifications à la demande et réutiliser les fonctions existantes. Éviter les fonctions, abstractions et changements de structure inutiles. Signaler et discuter les initiatives de conception qui dépassent la demande avant de les appliquer. Préserver les modifications déjà présentes dans l'espace de travail.

Pour une fonctionnalité complète, suivre son parcours depuis la route et le contrôleur jusqu'au service, au port et au repository. Ajouter les enregistrements nécessaires dans `container.ts` lorsque des dépendances sont créées. Ne pas supposer qu'un fichier vide possède déjà un comportement.

## Nommage et style

Employer les noms déjà utilisés par le projet, notamment `Exercice` dans le code et `exercises` dans la base. Les classes et fichiers d'entité utilisent PascalCase, les méthodes et variables camelCase, et les colonnes et attributs existants souvent snake_case. Respecter les noms existants même lorsqu'ils sont irréguliers.

Déclarer les types des propriétés et les types de retour des méthodes comme dans les fichiers voisins. Pour les requêtes de lecture communes, utiliser une propriété privée typée `string`, par exemple `private readonly selectExercice: string`. Utiliser des noms explicites et garder les méthodes simples. Les messages métier existants sont en français et les codes d'erreur en majuscules avec des underscores.

## Entités et fakers

Représenter les relations du domaine par des objets ou des tableaux d'objets, comme `user`, `roles`, `favorites` et `exercices`. Les identifiants de clés étrangères restent dans la base et les repositories. Les tables de liaison sont représentées par des collections dans les entités lorsque c'est le modèle retenu par le projet.

Chaque entité possède une fonction `make...Faker` dans son fichier, avec un paramètre optionnel `Partial<...>` et des valeurs déterministes. Déclarer en début de faker les objets créés par d'autres fakers dans des constantes nommées. Choisir la valeur fournie ou celle par défaut dans l'appel à `new`, avec `?.` et `??`, suivant les exemples existants. Avec `??`, `null` et `undefined` déclenchent tous deux la valeur par défaut.

Placer les validations intrinsèques dans l'entité lorsque c'est le modèle du fichier concerné, avec `validate()` et des méthodes `check...`. Utiliser `ApiError` pour les erreurs métier suivant les usages existants.

## Services, repositories et HTTP

Les ports définissent les opérations disponibles. Les services d'infrastructure délèguent aux repositories et invoquent les services métier lorsque nécessaire. Les contrôleurs reçoivent les requêtes Express, vérifient les données nécessaires, appellent le service et transmettent les erreurs à `next(error)`.

Dans les repositories implémentés, partager le `SELECT` de base entre les lectures et utiliser une méthode `make...` pour construire l'entité. Utiliser des paramètres SQL (`$1`, `$2`, etc.) pour les valeurs et respecter les noms réels des tables. Les lectures de relations sont incluses par défaut dans les méthodes publiques. Tenir compte des cycles possibles entre utilisateurs et favoris lors de la reconstruction.

Le propriétaire prévoit de traiter les transactions plus tard. Ne pas ajouter de `BEGIN`, `COMMIT` ou `ROLLBACK` aux repositories sans lui en parler. Respecter les comportements et contrats des méthodes existantes.

## Base et vérification

Pendant le développement actuel, le schéma est regroupé dans `migration_1.sql`. Garder les fixtures cohérentes avec les modifications de schéma. Les fixtures utilisent des scénarios déterministes et des identifiants stables. Les scénarios de lecture sont partagés, ceux de modification et de suppression sont réservés à des tests distincts. Leur convention est documentée en tête de `fixtures.sql`.

Les scripts disponibles sont `npm run build`, `npm test`, `npm run dev`, `npm run format:check` et `npm run uml`. Choisir les vérifications adaptées aux fichiers modifiés. Les scripts SQL montés par Docker s'exécutent à l'initialisation d'une base neuve. Préserver les données d'un volume existant sauf demande explicite.
