require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('./src/models/Table');

async function simulateClientFlow() {
    console.log('\n📱 --- DÉBUT SIMULATION CLIENT ---\n');

    // 1. Connexion à la base pour trouver un QR code valide
    console.log('🔍 Recherche d\'une table valide...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/menu-link');

    const table = await Table.findOne({ active: true });
    if (!table) {
        console.error('❌ Aucune table active trouvée. Avez-vous lancé "npm run seed" ?');
        process.exit(1);
    }

    const qrCode = table.qr_code;
    console.log(`📸 QR Code scanné sur la Table ${table.numero}: "${qrCode}"`);
    await mongoose.disconnect(); // On se déconnecte, on a ce qu'il faut

    // 2. Appel API : Création de session (Scan)
    const API_URL = `http://localhost:${process.env.PORT || 3000}/api`;

    console.log(`\n🔄 Envoi du QR Code au serveur (${API_URL}/sessions)...`);

    try {
        const sessionResponse = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qr_code: qrCode })
        });

        const sessionData = await sessionResponse.json();

        if (!sessionData.success) {
            throw new Error(`Erreur API: ${sessionData.error?.message}`);
        }

        console.log('✅ SESSION CRÉÉE avec succès !');
        console.log(`   📝 Session ID: ${sessionData.data.session_id}`);
        console.log(`   📍 Table ID:   ${sessionData.data.table_id}`);

        // 3. Appel API : Récupération du Menu
        console.log('\n🍽️  Chargement du Menu...');
        const menuResponse = await fetch(`${API_URL}/menu`);
        const menuData = await menuResponse.json();

        if (!menuData.success) {
            throw new Error(`Erreur Menu: ${menuData.error?.message}`);
        }

        console.log('✅ MENU REÇU !');
        const menu = menuData.data;
        console.log(`   📂 Catégories: ${menu.categories.length}`);
        console.log(`   🍲 Plats Total: ${menu.totalDishes}`);

        // Afficher un aperçu
        if (menu.categories.length > 0) {
            console.log('\n   Aperçu du Menu :');
            menu.categories.forEach(cat => {
                console.log(`     - [${cat.nom}] (${cat.dishes.length} plats)`);
                if (cat.dishes.length > 0) {
                    console.log(`         Ex: ${cat.dishes[0].nom} - ${cat.dishes[0].prix} FCFA`);
                }
            });
        }

    } catch (error) {
        console.error('\n❌ ERREUR LORS DU TEST :');
        console.error(error.message);
        console.log('\n💡 ASTUCE : Assurez-vous que le serveur tourne dans un autre terminal ("npm run dev")');
    }

    console.log('\n🏁 --- FIN SIMULATION ---');
}

simulateClientFlow();
