# Dockerfile pour le développement de l'application SHA-256 Visualizer
FROM node:20-alpine

# Installer les dépendances système de base
RUN apk add --no-cache git

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Commande par défaut : démarrer le serveur de dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

