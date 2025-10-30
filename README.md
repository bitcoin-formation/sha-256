# SHA-256 Visualizer 🔐

[English version below](#english-version)

---

Application web interactive et éducative pour comprendre l'algorithme de hachage cryptographique SHA-256, l'un des piliers de la technologie Bitcoin.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://bitcoin-formation.github.io/sha-256/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

🌐 **[Essayez la démo en ligne](https://bitcoin-formation.github.io/sha-256/)** 🌐

## 🎯 Caractéristiques

### Visualisation Interactive
- **5 Étapes Principales** : Message d'entrée, Préparation, Initialisation, Boucle principale (64 rounds), Résultat final
- **7 Sous-Étapes par Round** : Suivez chaque calcul (Σ1, Ch, temp1, Σ0, Maj, temp2, rotation)
- **Diagramme de Flux Animé** : Visualisation claire de l'algorithme avec code couleur
- **Pseudo-Code Synchronisé** : Code ligne par ligne suivant l'animation
- **État des Variables** : Affichage en temps réel des registres a-h avec animations

### Contrôles Avancés
- **Play/Pause** : Contrôle complet de l'animation
- **Navigation** : Avancer/reculer par step ou par round complet
- **Vitesse Réglable** : De 1x à 50x (défaut: 25x) pour s'adapter à votre rythme
- **Reset** : Revenir au début à tout moment

### Pédagogie
- **Tooltips Interactifs** : 
  - Étape 0 : Visualisez votre message en Hex, Decimal, Binary
  - Étape 1 : Explorez les valeurs W[0..63] avec distinction message original (bleu) vs expansion (rose)
  - Étape 5 : Hash final en hexadécimal
- **Rotation Parallèle** : Animation spéciale montrant la mise à jour simultanée des registres
- **Valeurs en Temps Réel** : Affichage des valeurs intermédiaires à chaque étape
- **Multilingue** : Interface en Français (Québec) et Anglais

## 🚀 Démarrage Rapide

### Avec Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/bitcoin-formation/sha-256.git
cd sha-256

# Lancer avec Docker Compose
docker compose up -d

# Accéder à l'application
open http://localhost:5173
```

### Sans Docker

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build de production
npm run build
```

## 🏗️ Architecture

```
sha-256/
├── src/
│   ├── components/          # Composants React
│   │   ├── CodeDisplay/     # Pseudo-code synchronisé
│   │   ├── FlowDiagram/     # Diagramme de flux principal
│   │   ├── Controls/        # Contrôles d'animation
│   │   ├── StateDisplay/    # État des registres
│   │   └── RoundIndicator/  # Indicateur de progression
│   ├── engines/             # Moteur SHA-256
│   │   └── sha256/
│   │       ├── sha256Engine.ts    # Implémentation principale
│   │       ├── operations.ts      # Opérations bit à bit
│   │       └── constants.ts       # Constantes K et H
│   ├── constants/           # Constantes globales
│   │   └── codeLineMapping.ts     # Mapping centralisé
│   ├── store/               # État global (Zustand)
│   ├── locales/             # Traductions (i18n)
│   └── types/               # Types TypeScript
└── QUALITY_ASSURANCE.md     # Guide d'assurance qualité
```

## 🎨 Technologies

- **React** + **TypeScript** : Interface utilisateur typée
- **Vite** : Build tool ultra-rapide avec HMR
- **Framer Motion** : Animations fluides
- **Zustand** : Gestion d'état légère
- **react-i18next** : Internationalisation
- **Docker** : Containerisation

## 📚 Comprendre SHA-256

### Qu'est-ce que SHA-256 ?

SHA-256 (Secure Hash Algorithm 256-bit) est une fonction de hachage cryptographique qui :
- Prend un message de taille arbitraire en entrée
- Produit un hash de 256 bits (64 caractères hexadécimaux) en sortie
- Est **déterministe** : même entrée = même sortie
- Est **irréversible** : impossible de retrouver le message depuis le hash
- Est **résistant aux collisions** : presque impossible de trouver deux messages avec le même hash

### Pourquoi SHA-256 dans Bitcoin ?

Bitcoin utilise SHA-256 de manière intensive :
- **Mining** : Trouver un hash commençant par un certain nombre de zéros
- **Merkle Trees** : Organisation des transactions dans les blocs
- **Addresses** : Génération d'adresses Bitcoin sécurisées
- **Proof of Work** : Consensus décentralisé du réseau

## 🔬 Algorithme en 5 Étapes

1. **Étape 0 : Message d'Entrée** - Votre texte brut
2. **Étape 1 : Préparation** - Padding et expansion du message en 64 mots W[0..63]
3. **Étape 2 : Initialisation** - Chargement des 8 variables de travail a-h
4. **Étape 3 : Boucle Principale** - 64 rounds avec 7 calculs chacun
5. **Étape 5 : Résultat** - Hash final de 256 bits

## 👥 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

Voir [QUALITY_ASSURANCE.md](QUALITY_ASSURANCE.md) pour les guidelines de développement.

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🔗 Liens Utiles

- [Spécification SHA-256 (FIPS 180-4)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)
- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Bitcoin Mining Explained](https://en.bitcoin.it/wiki/Mining)

---

<a name="english-version"></a>

# SHA-256 Visualizer 🔐 - English Version

Interactive and educational web application to understand the SHA-256 cryptographic hash algorithm, one of the pillars of Bitcoin technology.

🌐 **[Try the live demo](https://bitcoin-formation.github.io/sha-256/)** 🌐

## 🎯 Features

### Interactive Visualization
- **5 Main Steps**: Input message, Preparation, Initialization, Main loop (64 rounds), Final result
- **7 Sub-Steps per Round**: Follow each calculation (Σ1, Ch, temp1, Σ0, Maj, temp2, rotation)
- **Animated Flow Diagram**: Clear visualization with color coding
- **Synchronized Pseudocode**: Line-by-line code following the animation
- **Variable State Display**: Real-time display of a-h registers with animations

### Advanced Controls
- **Play/Pause**: Complete animation control
- **Navigation**: Move forward/backward by step or complete round
- **Adjustable Speed**: From 1x to 50x (default: 25x)
- **Reset**: Return to start anytime

### Educational Features
- **Interactive Tooltips**:
  - Step 0: Visualize your message in Hex, Decimal, Binary
  - Step 1: Explore W[0..63] values with distinction between original message (blue) vs expansion (pink)
  - Step 5: Final hash in hexadecimal
- **Parallel Rotation**: Special animation showing simultaneous register updates
- **Real-Time Values**: Display of intermediate values at each step
- **Multilingual**: Interface in French (Quebec) and English

## 🚀 Quick Start

### With Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/bitcoin-formation/sha-256.git
cd sha-256

# Start with Docker Compose
docker compose up -d

# Access the application
open http://localhost:5173
```

### Without Docker

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Production build
npm run build
```

## 🎨 Technologies

- **React** + **TypeScript**: Typed UI
- **Vite**: Ultra-fast build tool with HMR
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management
- **react-i18next**: Internationalization
- **Docker**: Containerization

## 📚 Understanding SHA-256

### What is SHA-256?

SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that:
- Takes an arbitrary-length message as input
- Produces a 256-bit hash (64 hex characters) as output
- Is **deterministic**: same input = same output
- Is **one-way**: impossible to retrieve the message from the hash
- Is **collision-resistant**: nearly impossible to find two messages with the same hash

### Why SHA-256 in Bitcoin?

Bitcoin uses SHA-256 extensively:
- **Mining**: Finding a hash starting with a certain number of zeros
- **Merkle Trees**: Organizing transactions in blocks
- **Addresses**: Generating secure Bitcoin addresses
- **Proof of Work**: Decentralized network consensus

## 🔬 Algorithm in 5 Steps

1. **Step 0: Input Message** - Your raw text
2. **Step 1: Preparation** - Padding and expansion into 64 words W[0..63]
3. **Step 2: Initialization** - Loading 8 working variables a-h
4. **Step 3: Main Loop** - 64 rounds with 7 calculations each
5. **Step 5: Result** - Final 256-bit hash

## 👥 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [QUALITY_ASSURANCE.md](QUALITY_ASSURANCE.md) for development guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [SHA-256 Specification (FIPS 180-4)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)
- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Bitcoin Mining Explained](https://en.bitcoin.it/wiki/Mining)

---

**Développé avec ❤️ pour la communauté Bitcoin | Developed with ❤️ for the Bitcoin community**
