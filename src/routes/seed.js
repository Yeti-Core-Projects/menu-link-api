/**
 * Seed route - Pour peupler la BD en production
 * À utiliser UNIQUEMENT en développement ou pour setup initial
 */

const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Dish = require('../models/Dish');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @route   POST /api/seed
 * @desc    Populate database with test data
 * @access  Public (⚠️ À sécuriser en production!)
 */
router.post('/', async (req, res) => {
  try {
    logger.info('Starting database seed...');

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

    // Create menu
    const menu = new Menu({
      nom: 'Menu Principal',
      gestionnaire_id: gestionnaire._id,
      actif: true,
    });
    await menu.save();

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

    logger.info('Database seeded successfully!');

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        tables: tables.length,
        menus: 1,
        categories: categories.length,
        dishes: dishes.length,
        users: 1,
        qr_codes: tables.map(t => ({
          table: t.numero,
          qr_code: t.qr_code
        }))
      }
    });

  } catch (error) {
    logger.error('Error seeding database', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'SEED_ERROR',
        message: 'Failed to seed database',
        details: error.message
      }
    });
  }
});

/**
 * @route   GET /api/seed/status
 * @desc    Check if database has data
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const counts = {
      tables: await Table.countDocuments(),
      menus: await Menu.countDocuments(),
      categories: await Category.countDocuments(),
      dishes: await Dish.countDocuments(),
      users: await User.countDocuments(),
    };

    const isEmpty = Object.values(counts).every(count => count === 0);

    res.status(200).json({
      success: true,
      data: {
        isEmpty,
        counts,
        message: isEmpty ? 'Database is empty. Run POST /api/seed to populate.' : 'Database has data.'
      }
    });

  } catch (error) {
    logger.error('Error checking seed status', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'STATUS_ERROR',
        message: 'Failed to check database status',
        details: error.message
      }
    });
  }
});

module.exports = router;
