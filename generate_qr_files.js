require('dotenv').config();
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const Table = require('./src/models/Table');

async function generateQRCodes() {
    console.log('🔄 Génération des images QR Code...');

    // Connexion à la base de données
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/menu-link';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Récupération des tables
    const tables = await Table.find({ active: true }).sort({ numero: 1 });

    if (tables.length === 0) {
        console.log('❌ Aucune table trouvée. Lancez "npm run seed" d\'abord.');
        process.exit(1);
    }

    // Création du dossier de sortie
    const outDir = path.join(__dirname, 'qr_codes');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    console.log(`📁 Sauvegarde dans : ${outDir}`);

    // Génération des ficheirs
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

        console.log(`🖨️  Généré : ${filename} \t(Contenu: "${table.qr_code}")`);
    }

    console.log('\n🎉 Terminé ! Les images sont prêtes.');
    await mongoose.disconnect();
}

generateQRCodes();
