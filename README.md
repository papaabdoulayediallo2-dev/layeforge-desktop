# LayeForge - Le Générateur d'Applications Desktop Autonome

**LayeForge est une solution innovante qui transforme instantanément n'importe quel projet web (HTML, CSS, JS) en un véritable logiciel Windows (.exe) professionnel, avec un accès direct à plus de 40 APIs natives et sans écrire une seule ligne de code Electron.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Zero Config](https://img.shields.io/badge/Node.js-None%20Required-success.svg)
![Free](https://img.shields.io/badge/Price-100%25%20Free-brightgreen.svg)
[![Star on GitHub](https://img.shields.io/github/stars/papaabdoulayediallo2-dev/layeforge-desktop?style=social)](https://github.com/papaabdoulayediallo2-dev/layeforge-desktop)

---

### Si LayeForge vous est utile, donnez-lui une étoile sur GitHub !

---

## Téléchargement Immédiat

Pour commencer à utiliser **LayeForge** sans attendre, téléchargez la version stable la plus récente :

**[Accéder aux Téléchargements LayeForge](https://github.com/papaabdoulayediallo2-dev/layeforge-desktop/releases/latest)**

---

## C'est quoi LayeForge ?

LayeForge est un outil de packaging "tout-en-un" (Electron generator) conçu pour combler le fossé entre le web et le bureau. 

En termes simples : vous lui donnez un dossier contenant vos fichiers web (votre site ou votre application), et il vous rend un fichier **.exe** que n'importe qui peut installer et lancer sur Windows, comme n'importe quel autre logiciel professionnel.

**Pourquoi l'utiliser ?**
1.  **Rapidité** : Créez une application desktop en moins de 2 minutes.
2.  **Accessibilité** : Pas besoin de comprendre le fonctionnement complexe d'Electron ou de Node.js.
3.  **Propreté** : Vos utilisateurs reçoivent un logiciel élégant, rapide et sécurisé.
4.  **100% Gratuit & Illimité** : Aucune limitation sur les fonctionnalités, pas d'abonnement, et aucun frais caché.
5.  **40+ APIs Natives** : Accès simplifié à l'impression, au système de fichiers, aux notifications, et bien plus encore.
6.  **Vraie Persistance** : Contrairement au cache web volatil, les données de la base de données sont stockées de façon permanente dans des fichiers physiques sur le disque.

---

## Pourquoi LayeForge est-il unique ?

Face aux solutions existantes comme **HTML Executable**, **Nativefier** ou **Web2Exe**, LayeForge se distingue par plusieurs innovations majeures :

### LayeForge vs La Concurrence

| Fonctionnalité | LayeForge | Solutions Classiques |
| :--- | :--- | :--- |
| **Configuration** | **Zéro config** : Tout est inclus. | Souvent complexe (nécessite Node.js, Python, ou des scripts). |
| **Indépendance** | **100% Autonome** : Pas besoin de Node.js sur le PC. | Nécessite souvent l'installation de runtimes externes. |
| **Persistance** | **Fichiers physiques (.db)** : Données sécurisées sur disque. | Souvent limité au cache navigateur ou localStorage. |
| **APIs Natives** | **40+ APIs simplifiées** (Print, DB, Notify). | Limité ou nécessite du code IPC complexe. |
| **Interface** | **Design moderne (Glassmorphism)** natif. | Design Windows standard ou basique. |
| **Prix** | **Gratuit et Illimité**. | Souvent payant (ex: HTML Executable) ou avec limites. |
| **Sécurité** | **Obfuscation intégrée en 1 clic**. | Optionnelle ou complexe à configurer. |

### Ce qui nous différencie :
LayeForge n'est pas qu'un simple "wrapper". C'est un **studio de création** complet qui injecte automatiquement des "Super-Pouvoirs" dans vos projets web, tout en restant plus léger et simple que n'importe quelle autre alternative du marché.

---

## Une Nouvelle Ère d'Indépendance

LayeForge franchit une étape majeure en devenant **totalement autonome**. Contrairement aux solutions traditionnelles qui exigent que vous configuriez vous-même votre environnement de développement, LayeForge est prêt à l'emploi dès son téléchargement.

### Zéro Dépendance Externe
L'utilisateur final n'a plus besoin d'installer Node.js, npm ou toute autre dépendance sur son système. LayeForge embarque son propre moteur d'exécution portable, garantissant une compatibilité immédiate sur n'importe quel ordinateur Windows.

---

## Guide d'Utilisation Simple

LayeForge a été conçu pour être intuitif. Le processus de création suit un cheminement structuré :

### Étape 1 : Préparation des Fichiers
Importez votre projet web. LayeForge supporte les fichiers HTML, CSS, JS, ainsi que tous vos assets (images, polices, JSON). Il vous suffit d'indiquer quel fichier est le point d'entrée principal (généralement `index.html`).

### Étape 2 : Configuration de l'Apparence
*   **Barre de titre** : Choisissez entre une barre Windows classique ou notre barre personnalisée moderne avec effet Glassmorphism.
*   **Splash Screen** : Activez un écran de chargement personnalisé pour un effet premium au lancement.
*   **Icônes** : Personnalisez l'icône de votre application et de l'installateur en un clic.

### Étape 3 : Activation des "Super-Pouvoirs" (APIs)
Cochez simplement les APIs natives dont votre application a besoin. LayeForge injectera automatiquement les permissions pour :
*   L'impression et le système de fichiers.
*   Le presse-papiers et les notifications système.
*   **Base de données locale (NeDB)** : Stockage persistant dans des fichiers `.db` (pas de cache volatil).
*   Et plus de 40 autres fonctionnalités natives.

### Étape 4 : Génération et Export
Lancez la compilation. LayeForge s'occupe de tout le processus technique et vous livre votre application sous deux formats :
*   **Portable** : Un seul fichier `.exe` qui s'exécute sans installation.
*   **Installateur** : Un setup professionnel pour une installation complète sur Windows.

---

## Communauté et Support

*   **[Contribuer](CONTRIBUTING.md)** : Vous voulez aider à améliorer LayeForge ?
*   **[Code de Conduite](CODE_OF_CONDUCT.md)** : Notre engagement pour une communauté saine.
*   **[Besoin d'aide ?](SUPPORT.md)** : Consultez notre guide de support.

---

## Capacités de l'API Native

| Catégorie | Services Inclus |
| :--- | :--- |
| **Système** | Gestion CPU, Infos OS, Contrôle de l'alimentation, Zoom |
| **Interface** | Tray Menu, Menus contextuels, Barre de progression, Notifications |
| **Données** | Base de données locale (NeDB persistant en fichier), Coffre-fort de mots de passe |
| **Fichiers** | Dialogues natifs, Lecture/Écriture directe, Impression |
| **Réseau** | HTTP natif, Gestion des cookies, Proxy, Téléchargements auto |

---

## Section Développeur (Contribution)

Si vous souhaitez modifier les sources de LayeForge ou participer à son développement :

### Prérequis Logiciels
*   Node.js (Version LTS)
*   npm

### Configuration de l'Environnement
```powershell
# Installation des dépendances
npm install

# Initialisation de l'environnement portable
npm run setup-env

# Lancement en mode dev
npm start

# Compilation de l'exécutable
npm run dist
```

---

## Détails Techniques

*   **Moteur de Rendu** : Chromium (via Electron)
*   **Logique Interne** : Node.js avec environnement portable intégré
*   **Interface Utilisateur** : Vanilla HTML/CSS/JS avec design Glassmorphism
*   **Protection** : Javascript Obfuscator intégré
*   **Distribution** : Electron Builder (NSIS & Portable)

---

## Licence

Ce projet est distribué sous la Licence MIT. Consultez le fichier `LICENSE` pour plus de détails.

---

## Téléchargement

**[Télécharger la dernière version de LayeForge](https://github.com/papaabdoulayediallo2-dev/layeforge-desktop/releases/latest)**

---

## Contact & Auteur

LayeForge est un projet développé par **Papa Abdoulaye Diallo**.

*   **Email** : [papaabdoulayediallo2@gmail.com](mailto:papaabdoulayediallo2@gmail.com)
*   **Formation** : Etudiant en Génie Logiciel à l'Institut Supérieur de l'Informatique (**ISI**) de Dakar.

---

*Développé par [Papa Abdoulaye Diallo](https://github.com/papaabdoulayediallo2-dev).*
