# 🚀 YozuLite — Setup & Démarrage

Ce projet contient **deux parties** :

- **Backend (API NestJS)** dans le dossier [`api/`](./api)
- **Frontend (React / Next.js)** dans le dossier [`yozu-lite/`](./yozu-lite)

---

## ⚙️ 1. Lancer l’environnement complet

### 🧩 Étape 1 — Démarrer les services backend

Depuis la **racine du projet**, exécute :

```bash
cd api && cp .env.example .env && cd ..
./api/scripts/setup.sh
```
Ce script :
- installe les dépendances backend (npm ci)
- démarre les conteneurs Docker (Postgres, Redis, etc.)
- attend que la base soit prête
- exécute les migrations Prisma
- peuple la base de données (scripts/seed.ts)

## 🧠 Étape 2 — Démarrer le serveur NestJS en mode développement
Ensuite, ouvre une nouvelle fenêtre de terminal et exécute :
```bash
cd api/
npm run start:dev
```

Le backend est alors disponible sur :
http://localhost:8080


Et le swagger sur :
http://localhost:3000/api/docs

## 💻 Étape 3 — Lancer le frontend (YozuLite)
Dans une autre fenêtre de terminal :
``` bash
cd yozu-lite/
npm install
npm run dev
```

Le frontend démarre sur :
http://localhost:3000


## 🧹 Scripts utiles
CommandeDescriptionbash api/scripts/setup.shLance toute la stack backend (install, docker, migrations, seed)bash api/scripts/clean-db.shVide la base de données Postgresbash api/scripts/stop-docker.shStoppe les conteneurs Dockerbash api/scripts/stop-docker.sh --nukeStoppe Docker et supprime les volumes (⚠️ efface toutes les données)

## 🐳 Services Docker
ServicePort localDescriptionPostgreSQL5433Base de données principaleRedis6379 (si activé)Cache / sessionsAPI (NestJS)3000Backend principalFront (Vite)5173Interface React/Next.js

✅ Vérification rapide


Accède à http://localhost:8080/api/docs → Swagger (API NestJS)


Accède à http://localhost:3000 → Interface YozuLite



🧑‍💻 Développement
Le projet suit une architecture monorepo :
``` bash
.
├── api/                # Backend NestJS + Prisma
│   ├── src/
│   ├── prisma/
│   ├── scripts/
│   └── docker-compose.yml
│
└── yozu-lite/          # Frontend React / Next.js
    ├── src/
    └── package.json
```

💡 Astuce
Si tu modifies ton schéma Prisma :
``` bash
cd api/
npx prisma generate
npx prisma migrate dev
```

### 🏁 Résumé des commandes essentielles
# 1️⃣ Démarrer tout (depuis la racine)
``` bash
/api/scripts/setup.sh
```
# 2️⃣ Lancer le backend
``` bash
cd api/
npm run start:dev
```

# 3️⃣ Lancer le frontend
``` bash
cd yozu-lite/
npm install
npm run dev
```


# ✨ Tip : Tu peux ouvrir 2 terminaux séparés :

- un pour le backend (npm run start:dev)
- un pour le frontend (npm run dev)


Cela facilite le développement simultané front/back.
