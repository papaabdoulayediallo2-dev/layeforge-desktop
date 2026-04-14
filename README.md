# LayeForge

> **Transformez vos projets web (HTML/CSS/JS) en applications desktop professionnelles sans aucune ligne de code Electron.**

LayeForge est un générateur d'applications desktop puissant et intuitif. Il permet de packager n'importe quel site web ou application web en un exécutable Windows (.exe) tout en offrant un accès simplifié à plus de **40 APIs natives** et des options de sécurité avancées.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)

---

##  Téléchargement

Si vous voulez utiliser **LayeForge** immédiatement sans avoir à installer Node.js, vous pouvez télécharger la version déjà prête à l'emploi :

**[Télécharger LayeForge (LATEST)](https://github.com/papaabdoulayediallo2-dev/layeforge-desktop/releases/latest)**

---

## Points Forts

*   **Simplicité Absolue** ![Fast](https://img.shields.io/badge/-Rapidité-7c3aed?style=flat-square&logo=lightning&logoColor=white)  
    Glissez-déposez vos fichiers et générez votre app en 4 étapes.
*   **40+ APIs Natives** ![API](https://img.shields.io/badge/-APIs-06b6d4?style=flat-square&logo=codeforces&logoColor=white)  
    Accès direct à l'impression, au système de fichiers, aux notifications, au presse-papiers, etc.
*   **Personnalisation Premium** ![Design](https://img.shields.io/badge/-Design-ec4899?style=flat-square&logo=brush&logoColor=white)  
    Barre de titre personnalisée (Glassmorphism, dégradés), Splash Screen, icônes sur mesure.
*   **Sécurité Intégrée** ![Security](https://img.shields.io/badge/-Sécurité-10b981?style=flat-square&logo=shield&logoColor=white)  
    Obfuscation du code JavaScript, désactivation des DevTools et protection du menu contextuel.
*   **Formats d'Export** ![Build](https://img.shields.io/badge/-Export-f59e0b?style=flat-square&logo=box&logoColor=white)  
    Version Portable (un seul fichier) ou Installateur (Setup NSIS).
*   **Base de Données** ![DB](https://img.shields.io/badge/-Database-3b82f6?style=flat-square&logo=database&logoColor=white)  
    Intégration native de NeDB (`window.db`) pour le stockage local.

---

## Aperçu

L'interface moderne de LayeForge vous guide pas à pas :

1.  **Importation** : Glissez vos fichiers ou sélectionnez un dossier.
2.  **Configuration** : Définissez le nom, la taille, l'apparence et les permissions.
3.  **Prévisualisation** : Testez votre application en temps réel avant la génération.
4.  **Génération** : Exportez votre projet complet ou compilez directement en .exe.

---

## Installation

### Prérequis
*   [Node.js](https://nodejs.org/) (Version LTS recommandée)
*   npm (installé avec Node.js)

### Commandes

| Action | Commande |
| :--- | :--- |
| **Installer les dépendances** | `npm install` |
| **Lancer LayeForge** | `npm start` |
| **Compiler en .exe (Portable)** | `npm run build` |

### Mise en route
1.  Clonez le dépôt ou téléchargez les sources.
2.  Installez les dépendances :
    ```powershell
    npm install
    ```
3.  Lancez l'application :
    ```powershell
    npm start
    ```

---

## Comment l'utiliser ?

### Étape 1 : Fichiers
Importez votre projet web. ElectronForge supporte les fichiers HTML, CSS, JS, ainsi que les assets (images, polices, JSON). Indiquez quel fichier est le point d'entrée principal (généralement `index.html`).

### Étape 2 : Configuration
*   **Apparence** : Choisissez entre une barre de titre Windows classique ou notre barre personnalisée moderne. Activez le **Splash Screen** pour un effet premium au lancement.
*   **APIs Natives** : Cochez les "Super-Powers" dont votre application a besoin (Shell, Clipboard, OS Info, etc.).
*   **Sécurité** : Activez l'obfuscation pour protéger votre code source avant la distribution.

---

## APIs Natives Disponibles

LayeForge injecte automatiquement les permissions et les objets nécessaires dans votre code JS :

| Catégorie | APIs Disponibles |
| :--- | :--- |
| **Système** | Impression, Infos CPU/OS, Veille, Zoom Interface |
| **Interface** | Tray Menu, Menu Clic-Droit, Barre de progression, Notifications |
| **Données** | Base de données (NeDB), Presse-papiers, Coffre-fort Mots de passe |
| **Fichiers** | Dialogues natifs, Lecture/Écriture directe |
| **Réseau** | Requêtes HTTP natives, Cookies, Proxy, Download auto |

---

## Stack Technique

*   **Runtime** : Electron
*   **Frontend** : HTML5, CSS3 (Glassmorphism), Vanilla JS
*   **Backend** : Node.js
*   **Outils de Build** : electron-builder, javascript-obfuscator
*   **Base de Données** : NeDB (Promises)

---

## Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---

*Développé par [Papa Abdoulaye Diallo (Laye)](https://github.com/papaabdoulayediallo2-dev).*
