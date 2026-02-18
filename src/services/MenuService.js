const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Dish = require('../models/Dish');
const logger = require('../utils/logger');

class MenuService {
  /**
   * Get complete menu with all categories and dishes
   * Returns empty arrays if no data exists
   */
  async getCompleteMenu() {
    try {
      // Get all active menus
      const menus = await Menu.find({ actif: true }).populate('gestionnaire_id');

      if (menus.length === 0) {
        logger.info('No active menus found, returning empty menu');
        return {
          categories: [],
          totalDishes: 0,
        };
      }

      // Get all categories for active menus
      const menuIds = menus.map(m => m._id);
      const categories = await Category.find({ menu_id: { $in: menuIds } })
        .sort({ ordre_affichage: 1 })
        .populate('menu_id');

      if (categories.length === 0) {
        logger.info('No categories found, returning empty menu');
        return {
          categories: [],
          totalDishes: 0,
        };
      }

      // Get all dishes for these categories
      const categoryIds = categories.map(c => c._id);
      const dishes = await Dish.find({ categorie_id: { $in: categoryIds }, disponible: true })
        .populate('categorie_id');

      if (dishes.length === 0) {
        logger.info('No dishes found, returning menu with empty categories');
        return {
          categories: categories.map(cat => ({
            _id: cat._id,
            nom: cat.nom,
            ordre_affichage: cat.ordre_affichage,
            dishes: [],
          })),
          totalDishes: 0,
        };
      }

      // Group dishes by category
      const menuData = categories.map(category => ({
        _id: category._id,
        nom: category.nom,
        ordre_affichage: category.ordre_affichage,
        dishes: dishes
          .filter(dish => dish.categorie_id._id.toString() === category._id.toString())
          .map(dish => ({
            _id: dish._id,
            nom: dish.nom,
            description: dish.description,
            prix: dish.prix,
            disponible: dish.disponible,
            image_url: dish.image_url,
          })),
      }));

      logger.info('Complete menu retrieved', {
        categoriesCount: categories.length,
        dishesCount: dishes.length,
      });

      return {
        _id: menus[0]._id,
        nom: menus[0].nom,
        categories: menuData,
        totalDishes: dishes.length,
      };
    } catch (error) {
      logger.error('Error getting complete menu', { error: error.message });
      throw error;
    }
  }

  /**
   * Get menu by ID
   */
  async getMenuById(menuId) {
    try {
      const menu = await Menu.findById(menuId).populate('gestionnaire_id');
      if (!menu) {
        throw new Error('Menu not found');
      }
      return menu;
    } catch (error) {
      logger.error('Error getting menu by ID', { error: error.message });
      throw error;
    }
  }

  /**
   * Create new menu
   */
  async createMenu(nom, gestionnaireId) {
    try {
      const menu = new Menu({
        nom,
        gestionnaire_id: gestionnaireId,
        actif: true,
      });

      await menu.save();
      logger.info('Menu created', { menuId: menu._id, nom });
      return menu;
    } catch (error) {
      logger.error('Error creating menu', { error: error.message });
      throw error;
    }
  }

  /**
   * Update menu
   */
  async updateMenu(menuId, updateData) {
    try {
      const menu = await Menu.findByIdAndUpdate(menuId, updateData, { new: true });
      if (!menu) {
        throw new Error('Menu not found');
      }
      logger.info('Menu updated', { menuId });
      return menu;
    } catch (error) {
      logger.error('Error updating menu', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete menu
   */
  async deleteMenu(menuId) {
    try {
      const menu = await Menu.findByIdAndDelete(menuId);
      if (!menu) {
        throw new Error('Menu not found');
      }
      logger.info('Menu deleted', { menuId });
      return menu;
    } catch (error) {
      logger.error('Error deleting menu', { error: error.message });
      throw error;
    }
  }
}

module.exports = new MenuService();
