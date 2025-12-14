# Formulaire COMAR Assurances - Version Node.js 🚀

Un formulaire de contact moderne optimisé pour mobile avec Node.js, Express et Nodemailer.

## 🎯 Pourquoi Node.js ?

### Avantages par rapport à PHP :
- ✅ **Plus rapide** : Serveur asynchrone non-bloquant
- ✅ **Un seul langage** : JavaScript côté client et serveur
- ✅ **Plus moderne** : Écosystème npm riche
- ✅ **Scalable** : Facile à déployer sur Vercel, Heroku, AWS
- ✅ **Développement rapide** : Hot reload avec nodemon
- ✅ **Meilleure gestion des erreurs** : async/await

## 📦 Installation

### Prérequis
- **Node.js** 16+ et npm (télécharger sur https://nodejs.org)
- Un compte Gmail avec mot de passe d'application

### Étapes

1. **Extraire le projet**
   ```bash
   cd comar-formulaire
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Modifiez le fichier `.env` :
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=votre-email@gmail.com
   EMAIL_PASS=votre-mot-de-passe-application
   RECIPIENT_EMAIL=destinataire@comar.ci
   PORT=3000
   ```

4. **Lancer le serveur**
   
   **Mode développement** (avec auto-reload) :
   ```bash
   npm run dev
   ```
   
   **Mode production** :
   ```bash
   npm start
   ```

5. **Accéder au formulaire**
   
   Ouvrir dans le navigateur : `http://localhost:3000`

## 📁 Structure du projet

```
comar-formulaire/
├── server.js           # Serveur Express principal
├── package.json        # Dépendances Node.js
├── .env               # Variables d'environnement (à configurer)
├── .gitignore         # Fichiers à ignorer par Git
├── README.md          # Ce fichier
└── public/            # Fichiers statiques
    ├── index.html     # Formulaire HTML
    └── hero-img.png   # Logo COMAR
```

## 🔐 Configuration Gmail

### Créer un mot de passe d'application

1. Aller sur https://myaccount.google.com/security
2. Activer la **validation en 2 étapes**
3. Rechercher "Mots de passe des applications"
4. Créer un nouveau mot de passe pour "Mail"
5. Copier le mot de passe dans `.env` → `EMAIL_PASS`

⚠️ **Important** : N'utilisez JAMAIS votre mot de passe Gmail principal !

## 🛠️ Commandes disponibles

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement (auto-reload)
npm run dev

# Démarrer en mode production
npm start

# Vérifier la santé du serveur
curl http://localhost:3000/health
```

## 📧 Routes disponibles

| Route | Méthode | Description |
|-------|---------|-------------|
| `/` | GET | Affiche le formulaire |
| `/send-email` | POST | Envoie l'email |
| `/health` | GET | Statut du serveur |

## 🎨 Caractéristiques

### Design
- **Couleurs COMAR** : Bleu #13134C, rouge #E31E24
- **Optimisé mobile** : Touch-friendly, pas de zoom
- **Pouce animé** : Confirmation visuelle aux couleurs COMAR
- **Barre de progression** : Indicateur visuel

### Technique
- **Express.js** : Framework web rapide
- **Nodemailer** : Envoi d'emails professionnels
- **CORS** : Support des requêtes cross-origin
- **Body-parser** : Parsing des données JSON
- **dotenv** : Gestion sécurisée des variables

### Validation
- ✅ Tous les champs requis
- ✅ Format email valide
- ✅ Format téléphone flexible
- ✅ Année entre 1900 et 2024

## 🚀 Déploiement

### Vercel (Recommandé - Gratuit)

1. Créer un compte sur https://vercel.com
2. Installer Vercel CLI :
   ```bash
   npm i -g vercel
   ```
3. Déployer :
   ```bash
   vercel
   ```
4. Configurer les variables d'environnement dans le dashboard Vercel

### Heroku

1. Créer un compte sur https://heroku.com
2. Installer Heroku CLI
3. Déployer :
   ```bash
   heroku login
   heroku create comar-formulaire
   git push heroku main
   heroku config:set EMAIL_USER=votre-email@gmail.com
   heroku config:set EMAIL_PASS=votre-mot-de-passe
   ```

### VPS (DigitalOcean, AWS, etc.)

1. Cloner le projet sur le serveur
2. Installer Node.js et npm
3. Configurer `.env`
4. Installer PM2 :
   ```bash
   npm install -g pm2
   pm2 start server.js --name comar-formulaire
   pm2 save
   pm2 startup
   ```
5. Configurer Nginx comme reverse proxy

## 🔧 Dépannage

### Le serveur ne démarre pas

**Problème** : Port déjà utilisé
```bash
# Trouver le processus qui utilise le port 3000
lsof -i :3000
# Tuer le processus
kill -9 [PID]
```

**Solution** : Changer le port dans `.env`
```env
PORT=3001
```

### L'email ne s'envoie pas

1. **Vérifier les identifiants** dans `.env`
2. **Tester la connexion SMTP** :
   ```bash
   node -e "require('./server.js')"
   ```
3. **Vérifier les logs** du serveur dans la console
4. **Autoriser "Applications moins sécurisées"** dans Gmail (déconseillé)

### Erreur CORS

Si vous hébergez le frontend et le backend séparément, ajoutez dans `server.js` :
```javascript
app.use(cors({
  origin: 'https://votre-domaine.com'
}));
```

## 📊 Logs et monitoring

Le serveur affiche des logs colorés :
- ✅ **Succès** : Email envoyé
- ❌ **Erreur** : Problème d'envoi
- 📧 **Configuration** : État de la connexion email

### Exemple de logs
```
✅ Serveur email prêt à envoyer des messages
🚀 Serveur COMAR démarré avec succès
   Port: 3000
   Email: contact@comar.ci
✅ Email envoyé: <message-id>
```

## 🔒 Sécurité

### Bonnes pratiques
- ✅ Variables d'environnement pour les secrets
- ✅ Validation côté serveur
- ✅ Protection contre les injections
- ✅ CORS configuré
- ✅ Gestion des erreurs

### À faire en production
- [ ] Activer HTTPS (Let's Encrypt gratuit)
- [ ] Limiter le taux de requêtes (rate limiting)
- [ ] Ajouter un CAPTCHA (Google reCAPTCHA)
- [ ] Logger dans un fichier (Winston)
- [ ] Monitorer avec PM2 ou New Relic

## 📱 Test sur mobile

1. **Sur le même réseau WiFi** :
   - Trouver l'IP de votre ordinateur : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
   - Sur le téléphone, aller sur `http://[IP]:3000`
   - Exemple : `http://192.168.1.100:3000`

2. **Test avec ngrok** (tunnel public) :
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```
   Utiliser l'URL fournie pour tester sur n'importe quel appareil

## 🆚 Différences avec PHP

| Fonctionnalité | PHP | Node.js |
|----------------|-----|---------|
| Serveur | Apache/Nginx requis | Intégré (Express) |
| Langage | PHP | JavaScript |
| Performance | Synchrone | Asynchrone |
| Déploiement | Hébergement PHP | Vercel, Heroku, etc. |
| Dépendances | Composer | npm |
| Hot reload | ❌ | ✅ (nodemon) |

## 💡 Extensions possibles

- [ ] Base de données (MongoDB, PostgreSQL)
- [ ] Historique des soumissions
- [ ] Panneau d'administration
- [ ] Notifications SMS (Twilio)
- [ ] Export CSV des contacts
- [ ] API REST complète
- [ ] Authentification JWT
- [ ] Tests automatisés (Jest)

## 📞 Support

- **Nodemailer** : https://nodemailer.com
- **Express** : https://expressjs.com
- **Node.js** : https://nodejs.org

## 🎓 Ressources pour apprendre

- **Node.js** : https://nodejs.dev/learn
- **Express** : https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs
- **JavaScript moderne** : https://javascript.info

## 📄 Licence

MIT - Libre d'utilisation pour projets personnels et commerciaux

---

**Développé avec ❤️ pour COMAR Assurances**

*C'est sérieux* 🛡️ - *Maintenant en Node.js* 🚀
