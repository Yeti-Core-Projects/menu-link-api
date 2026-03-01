/**
 * Script pour générer les QR codes depuis la base de données de production (MongoDB Atlas)
 * Usage: node generate_qr_production.js
 */

const mongoose = require('mongoose');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// URI de production MongoDB Atlas
const PRODUCTION_URI = 'mongodb+srv://arnauld:arnauld@cluster0.3m0gptw.mongodb.net/menu-link';

// Modèle Table (simplifié)
const tableSchema = new mongoose.Schema({
  numero: Number,
  qr_code: String,
  active: Boolean,
});
const Table = mongoose.model('Table', tableSchema);

async function generateQRCodesFromProduction() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas (Production)...');
    await mongoose.connect(PRODUCTION_URI);
    console.log('✅ Connecté à la base de données de production');

    // Récupération des tables
    const tables = await Table.find({ active: true }).sort({ numero: 1 });

    if (tables.length === 0) {
      console.log('❌ Aucune table trouvée dans la base de données de production.');
      console.log('💡 Assurez-vous que les données ont été peuplées avec le seed endpoint.');
      process.exit(1);
    }

    console.log(`📊 ${tables.length} table(s) trouvée(s) dans la base de données`);

    // Création du dossier de sortie
    const outDir = path.join(__dirname, 'qr_codes_production');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    console.log(`📁 Sauvegarde dans : ${outDir}\n`);

    // Génération des fichiers QR code
    for (const table of tables) {
      const filename = `table_${table.numero}.png`;
      const filepath = path.join(outDir, filename);

      // Le contenu du QR code est la chaîne unique stockée en base
      await QRCode.toFile(filepath, table.qr_code, {
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        width: 400,
        margin: 2
      });

      console.log(`🖨️  Généré : ${filename}`);
      console.log(`   └─ Contenu QR: "${table.qr_code}"`);
      console.log(`   └─ Fichier: ${filepath}\n`);
    }

    console.log('🎉 Terminé ! Les QR codes de production sont prêts.');
    console.log(`📂 Dossier: ${outDir}`);
    console.log('\n📋 Prochaines étapes:');
    console.log('   1. Ouvrir le dossier qr_codes_production/');
    console.log('   2. Imprimer les images PNG');
    console.log('   3. Coller les QR codes sur les tables physiques du restaurant');
    console.log('   4. Tester en scannant avec l\'application mobile\n');

    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB Atlas');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

generateQRCodesFromProduction();
