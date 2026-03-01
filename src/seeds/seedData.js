/**
 * Seed script to populate database with test data
 * Run with: node src/seeds/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('../models/Table');
const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Dish = require('../models/Dish');
const User = require('../models/User');
const logger = require('../utils/logger');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/menu-link');
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Table.deleteMany({});
    await Menu.deleteMany({});
    await Category.deleteMany({});
    await Dish.deleteMany({});
    await User.deleteMany({});
    logger.info('Cleared existing data');

    // Create a gestionnaire user
    const gestionnaire = new User({
      name: 'Admin Gestionnaire',
      email: 'gestionnaire@restaurant.com',
      password_hash: 'hashed_password_here',
      role: 'GESTIONNAIRE',
    });
    await gestionnaire.save();
    logger.info('Created gestionnaire user');

    // Create tables
    const tables = [];
    for (let i = 1; i <= 5; i++) {
      const table = new Table({
        numero: i,
        qr_code: `table_${i}_${Date.now()}`,
        active: true,
      });
      await table.save();
      tables.push(table);
    }
    logger.info(`Created ${tables.length} tables`);

    // Create menu
    const menu = new Menu({
      nom: 'Menu Principal',
      gestionnaire_id: gestionnaire._id,
      actif: true,
    });
    await menu.save();
    logger.info('Created menu');

    // Create categories
    const categories = [];
    const categoryNames = ['Entrées', 'Plats Principaux', 'Desserts', 'Boissons'];
    for (const name of categoryNames) {
      const category = new Category({
        menu_id: menu._id,
        nom: name,
        ordre_affichage: categoryNames.indexOf(name),
      });
      await category.save();
      categories.push(category);
    }
    logger.info(`Created ${categories.length} categories`);

    // Create dishes - Mix Cuisine Camerounaise et Moderne
    const dishesData = [
      // Entrées - Camerounaises
      { nom: 'Beignets Haricots', description: 'Beignets de haricots épicés (Accra)', prix: 500, categorie_id: categories[0]._id },
      { nom: 'Soya', description: 'Brochettes de bœuf marinées', prix: 1000, categorie_id: categories[0]._id },
      { nom: 'Poisson Braisé', description: 'Poisson frais grillé aux épices', prix: 2500, categorie_id: categories[0]._id },
      { nom: 'Bâtons de Manioc', description: 'Bâtons de manioc frits croustillants', prix: 800, categorie_id: categories[0]._id },
      { nom: 'Plantains Frits', description: 'Plantains mûrs frits dorés', prix: 700, categorie_id: categories[0]._id },
      
      // Entrées - Modernes
      { nom: 'Salade César', description: 'Salade romaine, poulet grillé, parmesan, croûtons', prix: 2500, categorie_id: categories[0]._id },
      { nom: 'Soupe du Jour', description: 'Soupe maison préparée quotidiennement', prix: 1500, categorie_id: categories[0]._id },
      { nom: 'Ailes de Poulet BBQ', description: '6 ailes de poulet sauce barbecue', prix: 2000, categorie_id: categories[0]._id },
      { nom: 'Calamars Frits', description: 'Anneaux de calamars panés avec sauce tartare', prix: 3000, categorie_id: categories[0]._id },
      { nom: 'Nachos Supreme', description: 'Nachos, fromage fondu, guacamole, crème', prix: 2500, categorie_id: categories[0]._id },
      
      // Plats Principaux - Camerounais
      { nom: 'Ndolé', description: 'Feuilles de ndolé aux arachides avec viande', prix: 3000, categorie_id: categories[1]._id },
      { nom: 'Eru', description: 'Légumes eru avec viande fumée et crevettes', prix: 3500, categorie_id: categories[1]._id },
      { nom: 'Koki', description: 'Gâteau de haricots cuit à la vapeur', prix: 1500, categorie_id: categories[1]._id },
      { nom: 'Poulet DG', description: 'Poulet Directeur Général avec plantains et légumes', prix: 4000, categorie_id: categories[1]._id },
      { nom: 'Sauce Arachide', description: 'Sauce d\'arachide avec viande et plantains', prix: 2500, categorie_id: categories[1]._id },
      { nom: 'Kondre', description: 'Plantains bouillis avec sauce tomate épicée', prix: 2000, categorie_id: categories[1]._id },
      { nom: 'Okok', description: 'Feuilles d\'okok avec crevettes et viande fumée', prix: 3500, categorie_id: categories[1]._id },
      { nom: 'Kati Kati', description: 'Poulet grillé mariné aux épices locales', prix: 3500, categorie_id: categories[1]._id },
      { nom: 'Poisson Sauce Gombo', description: 'Poisson frais en sauce gombo', prix: 3000, categorie_id: categories[1]._id },
      { nom: 'Sangha', description: 'Maïs pilé avec sauce jaune', prix: 2000, categorie_id: categories[1]._id },
      
      // Plats Principaux - Modernes
      { nom: 'Burger Classique', description: 'Steak haché, fromage, salade, tomate, oignons, frites', prix: 3500, categorie_id: categories[1]._id },
      { nom: 'Burger Poulet Crispy', description: 'Poulet pané croustillant, sauce mayo, frites', prix: 3200, categorie_id: categories[1]._id },
      { nom: 'Pizza Margherita', description: 'Sauce tomate, mozzarella, basilic frais', prix: 4000, categorie_id: categories[1]._id },
      { nom: 'Pizza 4 Fromages', description: 'Mozzarella, gorgonzola, parmesan, chèvre', prix: 4500, categorie_id: categories[1]._id },
      { nom: 'Pizza Pepperoni', description: 'Sauce tomate, mozzarella, pepperoni', prix: 4200, categorie_id: categories[1]._id },
      { nom: 'Pâtes Carbonara', description: 'Pâtes crémeuses, lardons, parmesan', prix: 3000, categorie_id: categories[1]._id },
      { nom: 'Pâtes Bolognaise', description: 'Pâtes sauce viande mijotée', prix: 2800, categorie_id: categories[1]._id },
      { nom: 'Steak Frites', description: 'Entrecôte grillée 250g avec frites maison', prix: 5000, categorie_id: categories[1]._id },
      { nom: 'Poulet Rôti', description: 'Demi-poulet rôti, frites et salade', prix: 3500, categorie_id: categories[1]._id },
      { nom: 'Poisson Grillé', description: 'Filet de poisson grillé, riz et légumes', prix: 4000, categorie_id: categories[1]._id },
      { nom: 'Tacos Poulet', description: '3 tacos au poulet, guacamole, fromage', prix: 2500, categorie_id: categories[1]._id },
      { nom: 'Shawarma Poulet', description: 'Wrap poulet mariné, sauce blanche, frites', prix: 2000, categorie_id: categories[1]._id },
      { nom: 'Shawarma Viande', description: 'Wrap viande marinée, sauce blanche, frites', prix: 2200, categorie_id: categories[1]._id },
      
      // Desserts - Camerounais
      { nom: 'Beignets Banane', description: 'Beignets de banane plantain sucrés', prix: 500, categorie_id: categories[2]._id },
      { nom: 'Puff Puff', description: 'Beignets sucrés moelleux', prix: 300, categorie_id: categories[2]._id },
      { nom: 'Fruits de Saison', description: 'Assortiment de fruits tropicaux frais', prix: 1000, categorie_id: categories[2]._id },
      { nom: 'Beignets Maïs', description: 'Beignets de maïs sucrés', prix: 400, categorie_id: categories[2]._id },
      
      // Desserts - Modernes
      { nom: 'Tiramisu', description: 'Dessert italien au café et mascarpone', prix: 2000, categorie_id: categories[2]._id },
      { nom: 'Crème Brûlée', description: 'Crème vanille caramélisée', prix: 2200, categorie_id: categories[2]._id },
      { nom: 'Fondant au Chocolat', description: 'Gâteau chocolat coulant, glace vanille', prix: 2500, categorie_id: categories[2]._id },
      { nom: 'Cheesecake', description: 'Gâteau au fromage, coulis fruits rouges', prix: 2300, categorie_id: categories[2]._id },
      { nom: 'Tarte Citron', description: 'Tarte au citron meringuée', prix: 2000, categorie_id: categories[2]._id },
      { nom: 'Glace 3 Boules', description: 'Vanille, chocolat, fraise', prix: 1500, categorie_id: categories[2]._id },
      { nom: 'Salade de Fruits', description: 'Fruits frais de saison', prix: 1200, categorie_id: categories[2]._id },
      
      // Boissons - Locales
      { nom: 'Jus de Bissap', description: 'Jus d\'hibiscus frais', prix: 500, categorie_id: categories[3]._id },
      { nom: 'Jus de Gingembre', description: 'Jus de gingembre épicé', prix: 500, categorie_id: categories[3]._id },
      { nom: 'Jus de Mangue', description: 'Jus de mangue naturel', prix: 700, categorie_id: categories[3]._id },
      { nom: 'Jus de Corossol', description: 'Jus de corossol frais', prix: 800, categorie_id: categories[3]._id },
      { nom: 'Jus d\'Ananas', description: 'Jus d\'ananas naturel', prix: 600, categorie_id: categories[3]._id },
      { nom: '33 Export', description: 'Bière locale 65cl', prix: 600, categorie_id: categories[3]._id },
      { nom: 'Beaufort', description: 'Bière locale 65cl', prix: 600, categorie_id: categories[3]._id },
      { nom: 'Castel', description: 'Bière 65cl', prix: 700, categorie_id: categories[3]._id },
      { nom: 'Top Grenadine', description: 'Boisson gazeuse locale', prix: 400, categorie_id: categories[3]._id },
      { nom: 'Top Orange', description: 'Boisson gazeuse orange', prix: 400, categorie_id: categories[3]._id },
      
      // Boissons - Modernes
      { nom: 'Coca Cola', description: 'Coca Cola 33cl', prix: 500, categorie_id: categories[3]._id },
      { nom: 'Coca Cola 1.5L', description: 'Coca Cola grande bouteille', prix: 1000, categorie_id: categories[3]._id },
      { nom: 'Fanta Orange', description: 'Fanta 33cl', prix: 500, categorie_id: categories[3]._id },
      { nom: 'Sprite', description: 'Sprite 33cl', prix: 500, categorie_id: categories[3]._id },
      { nom: 'Schweppes Tonic', description: 'Schweppes 33cl', prix: 600, categorie_id: categories[3]._id },
      { nom: 'Eau Minérale', description: 'Eau minérale 50cl', prix: 300, categorie_id: categories[3]._id },
      { nom: 'Eau Minérale 1.5L', description: 'Eau minérale grande bouteille', prix: 500, categorie_id: categories[3]._id },
      { nom: 'Eau Gazeuse', description: 'Eau gazeuse 50cl', prix: 500, categorie_id: categories[3]._id },
      { nom: 'Jus d\'Orange Pressé', description: 'Jus d\'orange frais pressé', prix: 1000, categorie_id: categories[3]._id },
      { nom: 'Smoothie Fruits', description: 'Smoothie fruits mixés', prix: 1500, categorie_id: categories[3]._id },
      { nom: 'Milkshake Vanille', description: 'Milkshake glace vanille', prix: 1500, categorie_id: categories[3]._id },
      { nom: 'Milkshake Chocolat', description: 'Milkshake glace chocolat', prix: 1500, categorie_id: categories[3]._id },
      { nom: 'Milkshake Fraise', description: 'Milkshake glace fraise', prix: 1500, categorie_id: categories[3]._id },
      { nom: 'Café Espresso', description: 'Café espresso italien', prix: 800, categorie_id: categories[3]._id },
      { nom: 'Café Américain', description: 'Café allongé', prix: 1000, categorie_id: categories[3]._id },
      { nom: 'Cappuccino', description: 'Café cappuccino mousseux', prix: 1200, categorie_id: categories[3]._id },
      { nom: 'Thé Chaud', description: 'Thé noir ou vert', prix: 700, categorie_id: categories[3]._id },
      { nom: 'Thé Glacé', description: 'Thé glacé citron', prix: 800, categorie_id: categories[3]._id },
    ];

    const dishes = [];
    for (const dishData of dishesData) {
      const dish = new Dish({
        nom: dishData.nom,
        description: dishData.description,
        prix: dishData.prix,
        categorie_id: dishData.categorie_id,
        disponible: true,
      });
      await dish.save();
      dishes.push(dish);
    }
    logger.info(`Created ${dishes.length} dishes`);

    logger.info('Database seeded successfully!');
    logger.info(`
      Tables: ${tables.length}
      Menu: 1
      Categories: ${categories.length}
      Dishes: ${dishes.length}
      
      Test QR codes:
      ${tables.map(t => `Table ${t.numero}: ${t.qr_code}`).join('\n      ')}
    `);

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

seedDatabase();
