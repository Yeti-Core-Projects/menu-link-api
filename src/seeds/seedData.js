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

    // Create dishes
    const dishesData = [
      // Entrées
      { nom: 'Salade César', description: 'Salade fraîche avec croutons', prix: 8.99, categorie_id: categories[0]._id },
      { nom: 'Soupe à l\'oignon', description: 'Soupe gratinée', prix: 7.99, categorie_id: categories[0]._id },
      // Plats Principaux
      { nom: 'Steak Frites', description: 'Steak grillé avec frites', prix: 18.99, categorie_id: categories[1]._id },
      { nom: 'Poulet Rôti', description: 'Poulet fermier rôti', prix: 15.99, categorie_id: categories[1]._id },
      { nom: 'Pâtes Carbonara', description: 'Pâtes à la sauce carbonara', prix: 12.99, categorie_id: categories[1]._id },
      // Desserts
      { nom: 'Tiramisu', description: 'Dessert italien classique', prix: 6.99, categorie_id: categories[2]._id },
      { nom: 'Crème Brûlée', description: 'Crème brûlée vanille', prix: 7.99, categorie_id: categories[2]._id },
      // Boissons
      { nom: 'Coca Cola', description: 'Boisson gazeuse', prix: 2.99, categorie_id: categories[3]._id },
      { nom: 'Jus d\'Orange', description: 'Jus frais', prix: 3.99, categorie_id: categories[3]._id },
      { nom: 'Vin Rouge', description: 'Vin rouge de la maison', prix: 5.99, categorie_id: categories[3]._id },
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
