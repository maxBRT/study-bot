# Objectifs du rapport

Afin de démontrer ma compréhension du système, ce rapport présente les points suivants :

* **Analyse de l'architecture** : Évaluation des avantages et des désavantages du modèle découplé.
* **Étude comparative** : Comparaison avec d'autres types de systèmes pour mettre en relief ses spécificités.
* **Retour d'expérience** : Partage de mon expérience de développement et des leçons apprises.
* **Choix techniques** : Justification du système d'authentification retenu.
* **Défis et solutions** : Analyse des obstacles rencontrés lors du développement.
* **Évolution** : Présentation des améliorations futures envisagées pour le projet.

## Architecture

L’application **Study Bot** présente une architecture découplée classique. Pour le type d’application que j’ai construit, ce choix n’était probablement pas le plus adapté et, avec le recul, j’opterais pour une approche différente si c’était à refaire.  
Cependant, dans un contexte académique, cette architecture m’a permis d’expérimenter avec des technologies que je n’aurais pas choisies de moi-même et de relever plusieurs défis, ce qui m’a fait progresser en tant que développeur.

Avant d’aller plus loin, il est pertinent de lister les avantages et les désavantages d’une architecture découplée.

#### Avantages

- **Expérience utilisateur fluide** : Une fois l’application chargée dans le navigateur, on retrouve un ressenti proche d’une application mobile grâce au modèle SPA.
- **Évolutivité** : Le frontend pourrait être déployé sur un CDN et le backend "scaled" plus facilement.
- **Préparation pour le futur** : Il serait plus simple de lancer une application web ou mobile qui consomme la même API.
- **Spécialisation** : Bien que non applicable ici, ce type d’architecture permettrait de choisir un langage plus spécialisé pour le backend (comme Python ou Go).
- **Facilite le travail d’équipe** : Avantage non pertinent dans ce contexte, mais réel dans un projet collaboratif.

#### Désavantages

- **Complexité initiale** : On ajoute la responsabilité de synchroniser le backend et le frontend.
- **SEO** : Une SPA en React offre peu ou pas de référencement naturel sans solutions supplémentaires.
- **Vitesse de développement** : Le développement est plus lent qu’avec des frameworks plus intégrés comme Next.js ou Laravel.

D’un point de vue purement objectif, les avantages peuvent sembler l’emporter sur les désavantages.  
Cependant, dans notre cas d’utilisation précis, l’application n’a pas de réel besoin d’évolutivité, nous sommes encore très loin du développement d’une application mobile (seulement à la v0.1 de la version web), TypeScript et Express étaient imposés et le projet a été réalisé en solo.  

Si l’on retire ces avantages théoriques, il devient clair qu’une autre solution architecturale aurait pu être plus pertinente et plus rentable dans ce contexte précis.

Next.js propose une approche plus adapté selon moi. Voici une analyse de ses avantages et désavantages.

#### Avantages
- **SEO performant** : le "King" du SEO
- **Vitesse de développement** : Pas juste un peu, beaucoup plus rapide qu'avec une architecture découpler
- **Flexibilité du rendu** : Possibilité de mélanger pages statiques (Comme le landing page), sans compromettre l'expérience dynamique (Le chat).
- **Architecture plus simple** : Le frontend et le backend peuvent cohabiter dans le même projet, réduisant la complexité. Les types peuvent également être partager.

#### Désavantages
- **Couplage plus fort** : Réduit la liberté de déployer ou faire évoluer chaque partie indépendamment.
- **Moins adapté aux API réutilisables** : Si l’objectif principal est de construire une API consommée par plusieurs clients, une architecture découplée peut être plus pertinente.
- **Dépendance au framework** : Certaines décisions techniques sont imposées par Next.js, ce qui peut limiter la liberté architecturale à long terme.

En résumé, dans notre cas particulier avec une architechture découplé, on subit tous les désavantage sans jouir des avantages et avec Next.js c'est tous le contraire.

## Authentification

Pour le système d’authentification, j’ai choisi d’utiliser [Better Auth](https://www.better-auth.com/).

La raison principale derrière ce choix est que je souhaitais intégrer une **librairie d’authentification**, plutôt qu’un **service d’authentification**. Cette approche me donne plus de contrôle sur l’implémentation, mais surtout, dans un contexte académique, me permet de mieux comprendre le fonctionnement interne du mécanisme d’authentification.

Les différences princiale entre better-auth et clerk, par exemple, sont les suivante:


1. **Stateful** vs **Stateless** : Better Auth utilise un système de sessions *stateful*, contrairement à Clerk qui repose principalement sur des JWT, donc une approche *stateless*.

Avec une session, chaque requête nécessite une validation côté serveur : on vérifie dans la base de données si la session est valide, à quel utilisateur elle est associée et quelles sont ses permissions. Le serveur conserve donc un état.

Avec un JWT, le serveur ne garde aucune mémoire de la session. Le token est simplement déchiffré et toutes les informations nécessaires (identité de l’utilisateur, permissions, expiration) sont contenues directement dans le JWT et envoyées à chaque requête.

2. **Librairie** vs **Service** : Better Auth est une librairie open source que l’on intègre directement dans son application, alors que Clerk est un service externe.

Avec Better Auth, toute la logique d’authentification (sessions, utilisateurs, permissions) fait partie de l’application, le code roule sur notre serveur. Les données sont stockées dans la base de données du projet.

Avec Clerk, une grande partie de la logique et des données d’authentification est gérée par un service tiers. Cela permet une mise en place très rapide, mais implique une dépendance externe, moins de contrôle et un coût potentiel à long terme.

Je pense que les deux solutions sont tout à fait valable, mais je suis très content d'avoir utiliser better-auth comme ça ma permit de voir les deux systèmes au cours de la même session.

## Défi rencontrés



## Améliorations futures