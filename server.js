// Importation des modules
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Vérifier la configuration email au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de configuration email:', error);
  } else {
    console.log('✅ Serveur email prêt à envoyer des messages');
  }
});

// Route principale - Servir le formulaire
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route de soumission du formulaire
app.post('/send-email', async (req, res) => {
  try {
    // Récupération et nettoyage des données
    const { nom, prenom, telephone, email, annee } = req.body;

    // Validation des champs
    if (!nom || !prenom || !telephone || !email || !annee) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email invalide'
      });
    }

    // Validation de l'année
    const year = parseInt(annee);
    if (isNaN(year) || year < 1900 || year > 2024) {
      return res.status(400).json({
        success: false,
        message: 'Année invalide'
      });
    }

    // Calcul de l'âge
    const age = new Date().getFullYear() - year;

    // Date et heure de soumission
    const dateSubmission = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Construction de l'email HTML
    const htmlEmail = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Contact - COMAR Assurances</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Container principal -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    
                    <!-- En-tête simple -->
                    <tr>
                        <td style="background-color: #13134C; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                Nouveau Contact
                            </h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                                ${dateSubmission}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 30px;">
                            
                            <!-- Message -->
                            <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px; line-height: 1.5;">
                                Vous avez reçu une nouvelle demande de contact :
                            </p>
                            
                            <!-- Tableau des informations -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                
                                <!-- Nom -->
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; width: 30%;">
                                        <strong style="color: #13134C; font-size: 14px;">Nom</strong>
                                    </td>
                                    <td style="padding: 15px; background-color: #ffffff; border-bottom: 1px solid #e9ecef; color: #333333; font-size: 15px;">
                                        ${nom}
                                    </td>
                                </tr>
                                
                                <!-- Prénom -->
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                                        <strong style="color: #13134C; font-size: 14px;">Prénom</strong>
                                    </td>
                                    <td style="padding: 15px; background-color: #ffffff; border-bottom: 1px solid #e9ecef; color: #333333; font-size: 15px;">
                                        ${prenom}
                                    </td>
                                </tr>
                                
                                <!-- Téléphone -->
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                                        <strong style="color: #13134C; font-size: 14px;">Téléphone</strong>
                                    </td>
                                    <td style="padding: 15px; background-color: #ffffff; border-bottom: 1px solid #e9ecef;">
                                        <a href="tel:${telephone}" style="color: #121212ff; text-decoration: none; font-size: 15px; font-weight: 600;">
                                            ${telephone}
                                        </a>
                                    </td>
                                </tr>
                                
                                <!-- Email -->
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                                        <strong style="color: #13134C; font-size: 14px;">Email</strong>
                                    </td>
                                    <td style="padding: 15px; background-color: #ffffff; border-bottom: 1px solid #e9ecef;">
                                        <a href="mailto:${email}" style="color: #020202ff; text-decoration: none; font-size: 15px; font-weight: 600;">
                                            ${email}
                                        </a>
                                    </td>
                                </tr>
                                
                                <!-- Année -->
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa;">
                                        <strong style="color: #13134C; font-size: 14px;">Année de naissance</strong>
                                    </td>
                                    <td style="padding: 15px; background-color: #ffffff; color: #333333; font-size: 15px;">
                                        ${annee} (${age} ans)
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Boutons d'action -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 10px;" width="50%">
                                        <a href="mailto:${email}" style="display: block; padding: 15px 20px; background-color: #13134C; color: #ffffff; text-align: center; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                                            Envoyer un email
                                        </a>
                                    </td>
                                    <td style="padding: 10px;" width="50%">
                                        <a href="tel:${telephone}" style="display: block; padding: 15px 20px; background-color: #E31E24; color: #ffffff; text-align: center; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                                            Appeler
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Pied de page -->
                    <tr>
                        <td style="padding: 25px 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #6c757d; font-size: 13px; line-height: 1.6;">
                                <strong style="color: #13134C;">COMAR Assurances</strong><br>
                                Formulaire de contact automatique<br>
                                <span style="font-size: 12px; color: #adb5bd;">Ne pas répondre à cet email</span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    // Version texte brut (fallback)
    const textEmail = `
Nouveau contact - COMAR Assurances

Nom: ${nom}
Prénom: ${prenom}
Téléphone: ${telephone}
Email: ${email}
Année de naissance: ${annee} (${age} ans)

Soumis le ${dateSubmission}
    `;

    // Configuration de l'email
    const mailOptions = {
      from: `"Formulaire COMAR" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL.split(',').map(email => email.trim()).join(','),
      replyTo: email,
      subject: `Nouveau contact : ${prenom} ${nom}`,
      text: textEmail,
      html: htmlEmail
    };

    // Envoi de l'email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email envoyé:', info.messageId);

    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Email envoyé avec succès',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email',
      error: error.message
    });
  }
});

// Route de test de santé du serveur
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 Serveur COMAR démarré avec succès    ║
║                                            ║
║   📡 Port: ${PORT}                           ║
║   🌐 URL: http://localhost:${PORT}          ║
║   📧 Email: ${process.env.EMAIL_USER}      ║
║                                            ║
║   C'est sérieux 🛡️                        ║
╚════════════════════════════════════════════╝
  `);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('👋 Arrêt du serveur en cours...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur en cours...');
  process.exit(0);
});