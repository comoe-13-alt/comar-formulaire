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
    <title>Nouvelle soumission de formulaire</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- En-tête avec gradient COMAR -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #13134C 0%, #E31E24 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Nouveau Contact
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 400;">
                                Formulaire soumis le ${dateSubmission}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">
                                Vous avez reçu une nouvelle soumission de formulaire avec les informations suivantes :
                            </p>
                            
                            <!-- Tableau des informations -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                                
                                <tr>
                                    <td style="padding: 18px 20px; background-color: #f7fafc; border-bottom: 1px solid #e2e8f0; width: 35%;">
                                        <strong style="color: #2d3748; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Nom
                                        </strong>
                                    </td>
                                    <td style="padding: 18px 20px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; color: #1a202c; font-size: 16px;">
                                        ${nom}
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 18px 20px; background-color: #f7fafc; border-bottom: 1px solid #e2e8f0;">
                                        <strong style="color: #2d3748; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Prénom
                                        </strong>
                                    </td>
                                    <td style="padding: 18px 20px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; color: #1a202c; font-size: 16px;">
                                        ${prenom}
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 18px 20px; background-color: #f7fafc; border-bottom: 1px solid #e2e8f0;">
                                        <strong style="color: #2d3748; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Téléphone
                                        </strong>
                                    </td>
                                    <td style="padding: 18px 20px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0;">
                                        <a href="tel:${telephone}" style="color: #13134C; text-decoration: none; font-size: 16px; font-weight: 500;">
                                            ${telephone}
                                        </a>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 18px 20px; background-color: #f7fafc; border-bottom: 1px solid #e2e8f0;">
                                        <strong style="color: #2d3748; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Email
                                        </strong>
                                    </td>
                                    <td style="padding: 18px 20px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0;">
                                        <a href="mailto:${email}" style="color: #13134C; text-decoration: none; font-size: 16px; font-weight: 500;">
                                            ${email}
                                        </a>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 18px 20px; background-color: #f7fafc;">
                                        <strong style="color: #2d3748; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Année de naissance
                                        </strong>
                                    </td>
                                    <td style="padding: 18px 20px; background-color: #ffffff; color: #1a202c; font-size: 16px;">
                                        ${annee} <span style="color: #718096; font-size: 14px;">(${age} ans)</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Bouton d'action -->
                            <div style="margin-top: 35px; text-align: center;">
                                <a href="mailto:${email}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #13134C 0%, #E31E24 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(19, 19, 76, 0.3);">
                                    Répondre au contact
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Pied de page -->
                    <tr>
                        <td style="padding: 30px; background-color: #f7fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.6;">
                                Cet email a été généré automatiquement par votre formulaire de contact COMAR.<br>
                                <span style="color: #a0aec0;">Pour toute question, contactez votre administrateur système.</span>
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
      to: process.env.RECIPIENT_EMAIL,
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
