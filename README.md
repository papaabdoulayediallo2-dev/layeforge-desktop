# LayeForge - Le Générateur d'Applications Desktop Autonome

**LayeForge est une solution innovante qui transforme instantanément n'importe quel projet web (HTML, CSS, JS) en un véritable logiciel Windows (.exe) professionnel, sans écrire une seule ligne de code Electron.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Zero Config](https://img.shields.io/badge/Node.js-None%20Required-success.svg)
![Free](https://img.shields.io/badge/Price-100%25%20Free-brightgreen.svg)

---

## 📥 Téléchargement Immédiat

Pour commencer à utiliser **LayeForge** sans attendre, téléchargez la version stable la plus récente :

**[Accéder aux Téléchargements LayeForge](https://github.com/papaabdoulayediallo2-dev/layeforge-desktop/releases/latest)**

---

## C'est quoi LayeForge ?

LayeForge est un outil de packaging "tout-en-un" conçu pour combler le fossé entre le web et le bureau. 

En termes simples : vous lui donnez un dossier contenant vos fichiers web (votre site ou votre application), et il vous rend un fichier **.exe** que n'importe qui peut installer et lancer sur Windows, comme n'importe quel autre logiciel professionnel.

**Pourquoi l'utiliser ?**
1.  **🚀 Rapidité** : Créez une application desktop en moins de 2 minutes.
2.  **🧠 Accessibilité** : Pas besoin de comprendre le fonctionnement complexe d'Electron ou de Node.js.
3.  **💎 Propreté** : Vos utilisateurs reçoivent un logiciel élégant, rapide et sécurisé.
4.  **🎁 100% Gratuit & Illimité** : Aucune limitation sur les fonctionnalités, pas d'abonnement, et aucun frais caché.

---

## Pourquoi LayeForge est-il unique ?

Face aux solutions existantes comme **HTML Executable**, **Nativefier** ou **Web2Exe**, LayeForge se distingue par plusieurs innovations majeures :

### LayeForge vs La Concurrence

| Fonctionnalité | LayeForge | Solutions Classiques |
| :--- | :--- | :--- |
| **Configuration** | **Zéro config** : Tout est inclus. | Souvent complexe (nécessite Node.js, Python, ou des scripts). |
| **Indépendance** | **100% Autonome** : Pas besoin de Node.js sur le PC. | Nécessite souvent l'installation de runtimes externes. |
| **APIs Natives** | **40+ APIs simplifiées** (Print, DB, Notify). | Limité ou nécessite du code IPC complexe. |
| **Interface** | **Design moderne (Glassmorphism)** natif. | Design Windows standard ou basique. |
| **Prix** | **Gratuit et Illimité**. | Souvent payant (ex: HTML Executable) ou avec limites. |
| **Sécurité** | **Obfuscation intégrée en 1 clic**. | Optionnelle ou complexe à configurer. |

### Ce qui nous dépasse :
LayeForge n'est pas qu'un simple "wrapper". C'est un **studio de création** complet qui injecte automatiquement des "Super-Pouvoirs" dans vos projets web, tout en restant plus léger et simple que n'importe quelle autre alternative du marché.

---

## Une Nouvelle Ère d'Indépendance

LayeForge franchit une étape majeure en devenant **totalement autonome**. Contrairement aux solutions traditionnelles qui exigent que vous configuriez vous-même votre environnement de développement, LayeForge est prêt à l'emploi dès son téléchargement.

### Zéro Dépendance Externe
L'utilisateur final n'a plus besoin d'installer Node.js, npm ou toute autre dépendance sur son système. LayeForge embarque son propre moteur d'exécution portable, garantissant une compatibilité immédiate sur n'importe quel ordinateur Windows.

---

## Caractéristiques Principales

### Accessibilité Totale
Convertissez vos fichiers web par simple glisser-déposer. Le processus est simplifié en 4 étapes logiques pour une productivité maximale.

### Intégration Native Étendue
Accédez à plus de 40 APIs natives pour donner à vos web-apps les capacités d'un logiciel de bureau :
*   Gestion avancée de l'impression et du système de fichiers.
*   Notifications systèmes et menus contextuels personnalisés.
*   Accès sécurisé au presse-papiers et informations système.
*   Gestion du stockage local via une base de données NeDB intégrée.

---

## Guide d'Utilisation Simple

Le processus de création suit un cheminement structuré :

1.  **Importation des Sources** : Sélectionnez votre dossier source et désignez votre point d'entrée (ex: `index.html`).
2.  **Configuration de l'Interface** : Définissez le nom, les couleurs et les comportements de votre application.
3.  **Activation des Capacités** : Choisissez les APIs natives nécessaires à votre projet.
4.  **Génération et Export** : Lancez la compilation pour obtenir un exécutable portable ou un installateur complet.

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

## Capacités de l'API Native

| Catégorie | Services Inclus |
| :--- | :--- |
| **Système** | Gestion CPU, Infos OS, Contrôle de l'alimentation, Zoom |
| **Interface** | Tray Menu, Menus contextuels, Barre de progression, Notifications |
| **Données** | Base de données locale (NeDB), Coffre-fort de mots de passe |
| **Réseau** | HTTP natif, Gestion des cookies, Proxy, Téléchargements auto |

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

## 🚀 Téléchargement

**[Télécharger la dernière version de LayeForge](https://github.com/papaabdoulayediallo2-dev/layeforge-desktop/releases/latest)**

---

*Développé par [Papa Abdoulaye Diallo](https://github.com/papaabdoulayediallo2-dev).*
