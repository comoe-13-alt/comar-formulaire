# 🚀 Guide Rapide - Démarrage en 5 minutes

## Étape 1 : Installer Node.js
Télécharger et installer depuis : https://nodejs.org (version LTS recommandée)

## Étape 2 : Installer les dépendances
```bash
npm install
```

## Étape 3 : Configurer l'email
Modifier le fichier `.env` :
```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application
RECIPIENT_EMAIL=destinataire@comar.ci
```

### 📧 Comment obtenir le mot de passe d'application Gmail ?

1. Allez sur : https://myaccount.google.com/security
2. Activez la "Validation en 2 étapes"
3. Recherchez "Mots de passe des applications"
4. Créez un nouveau mot de passe pour "Mail"
5. Copiez-le dans `.env`

## Étape 4 : Démarrer le serveur
```bash
npm start
```

## Étape 5 : Tester
Ouvrir dans le navigateur : http://localhost:3000

---

## 📱 Tester sur téléphone

### Option 1 : Sur le même WiFi
1. Trouver l'IP de votre PC :
   - Windows : `ipconfig`
   - Mac/Linux : `ifconfig`
2. Sur le téléphone : `http://[VOTRE_IP]:3000`
   - Exemple : `http://192.168.1.100:3000`

### Option 2 : Avec ngrok (tunnel public)
```bash
npm install -g ngrok
ngrok http 3000
```
Utilisez l'URL fournie (ex: https://abc123.ngrok.io)

---

## 🚨 Problèmes courants

### "Port 3000 already in use"
Changez le port dans `.env` :
```env
PORT=3001
```

### "SMTP Error"
- Vérifiez vos identifiants dans `.env`
- Assurez-vous d'utiliser un mot de passe d'application (pas votre mot de passe Gmail)
- Vérifiez que la validation en 2 étapes est activée

### "Cannot find module"
```bash
npm install
```

---

## 📦 Commandes utiles

```bash
# Installation
npm install

# Démarrer (production)
npm start

# Démarrer (développement avec auto-reload)
npm run dev

# Vérifier la santé du serveur
curl http://localhost:3000/health
```

---

## 🎯 Prêt pour la production ?

### Déployer gratuitement sur Vercel :
```bash
npm i -g vercel
vercel
```

Suivez les instructions, configurez vos variables d'environnement dans le dashboard Vercel, et voilà ! 🎉

---

**Besoin d'aide ?** Consultez le README-NODEJS.md complet
