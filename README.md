# LayeForge

**Transformez vos projets web en applications desktop professionnelles avec une autonomie totale.**

LayeForge est une solution de packaging avancée conçue pour les développeurs et créateurs web. Elle permet de convertir n'importe quel site ou application HTML/CSS/JS en un exécutable Windows (.exe) parfaitement intégré, sans nécessiter la moindre connaissance en Electron.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Zero Config](https://img.shields.io/badge/Node.js-None%20Required-success.svg)

---

## Une Nouvelle Ère d'Indépendance

LayeForge franchit une étape majeure en devenant totalement autonome. Contrairement aux solutions traditionnelles qui exigent une configuration complexe de l'environnement, LayeForge est prêt à l'emploi dès son téléchargement.

### Zéro Dépendance Externe
L'utilisateur final n'a plus besoin d'installer Node.js, npm ou toute autre dépendance sur son système. LayeForge embarque son propre moteur d'exécution portable, garantissant une compatibilité immédiate sur n'importe quel ordinateur Windows.

### Gestion Intelligente du Workflow
Le moteur de LayeForge gère automatiquement le téléchargement, la configuration et l'isolement des outils nécessaires à la compilation. Tout se passe de manière transparente en arrière-plan.

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

### Design et Personnalisation Premium
Maîtrisez l'esthétique de votre application :
*   Barre de titre moderne avec effets de transparence (Glassmorphism).
*   Configuration de Splash Screens pour un démarrage professionnel.
*   Personnalisation complète de l'icône et des dimensions de la fenêtre.

### Sécurité Critique
Protégez votre propriété intellectuelle grâce à l'obfuscation automatique du code source et au verrouillage des outils de développement (DevTools) pour les versions de production.

---

## Guide d'Utilisation Simple

LayeForge a été conçu pour être intuitif. Le processus de création suit un cheminement structuré :

1.  **Importation des Sources** : Sélectionnez votre dossier source et désignez votre point d'entrée (ex: `index.html`).
2.  **Configuration de l'Interface** : Définissez le nom, les couleurs et les comportements de votre application.
3.  **Activation des Capacités** : Choisissez les APIs natives nécessaires à votre projet.
4.  **Génération et Export** : Lancez la compilation pour obtenir un exécutable portable ou un installateur complet.

---

## Téléchargement Immédiat

Pour commencer à utiliser LayeForge, téléchargez la version stable la plus récente :

**[Accéder aux Téléchargements LayeForge](https://github.com/papaabdoulayediallo2-dev/layeforge-desktop/releases/latest)**

---

## Section Développeur (Contribution)

Si vous souhaitez modifier les sources de LayeForge ou participer à son développement, suivez ces instructions :

### Prérequis Logiciels
*   Node.js (Version LTS)
*   npm

### Configuration de l'Environnement
```powershell
# Installation des dépendances du projet
npm install

# Initialisation de l'environnement portable interne
npm run setup-env

# Lancement en mode développement
npm start

# Compilation de l'exécutable LayeForge
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

*Développé avec passion par [Papa Abdoulaye Diallo](https://github.com/papaabdoulayediallo2-dev).*
