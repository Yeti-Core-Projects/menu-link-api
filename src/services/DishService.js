const Dish = require('../models/Dish');
const Category = require('../models/Category');
const logger = require('../utils/logger');

class DishService {
  /**
   * Create new dish
   */
  async createDish(dishData) {
    try {
      // Verify category exists
      const category = await Category.findById(dishData.categorie_id);
      if (!category) {
        throw new Error('Category not found');
      }

      const dish = new Dish({
        nom: dishData.nom,
        description: dishData.description,
        prix: dishData.prix,
        categorie_id: dishData.categorie_id,
        disponible: dishData.disponible !== false,
        image_url: dishData.image_url,
      });

      await dish.save();
      logger.info('Dish created', { dishId: dish._id, nom: dish.nom });
      return dish;
    } catch (error) {
      logger.error('Error creating dish', { error: error.message });
      throw error;
    }
  }

  /**
   * Get dish by ID
   */
  async getDishById(dishId) {
    try {
      const dish = await Dish.findById(dishId).populate('categorie_id');
      if (!dish) {
        throw new Error('Dish not found');
      }
      return dish;
    } catch (error) {
      logger.error('Error getting dish by ID', { error: error.message });
      throw error;
    }
  }

  /**
   * Get all dishes by category
   */
  async getDishesByCategory(categoryId) {
    try {
      const dishes = await Dish.find({ categorie_id: categoryId, disponible: true });
      return dishes;
    } catch (error) {
      logger.error('Error getting dishes by category', { error: error.message });
      throw error;
    }
  }

  /**
   * Get all dishes
   */
  async getAllDishes() {
    try {
      const dishes = await Dish.find().populate('categorie_id');
      return dishes;
    } catch (error) {
      logger.error('Error getting all dishes', { error: error.message });
      throw error;
    }
  }

  /**
   * Update dish
   */
  async updateDish(dishId, updateData) {
    try {
      const dish = await Dish.findByIdAndUpdate(dishId, updateData, { new: true });
      if (!dish) {
        throw new Error('Dish not found');
      }
      logger.info('Dish updated', { dishId });
      return dish;
    } catch (error) {
      logger.error('Error updating dish', { error: error.message });
      throw error;
    }
  }

  /**
   * Toggle dish availability
   */
  async toggleAvailability(dishId) {
    try {
      const dish = await Dish.findById(dishId);
      if (!dish) {
        throw new Error('Dish not found');
      }

      dish.disponible = !dish.disponible;
      await dish.save();

      logger.info('Dish availability toggled', { dishId, disponible: dish.disponible });
      return dish;
    } catch (error) {
      logger.error('Error toggling dish availability', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete dish
   */
  async deleteDish(dishId) {
    try {
      const dish = await Dish.findByIdAndDelete(dishId);
      if (!dish) {
        throw new Error('Dish not found');
      }
      logger.info('Dish deleted', { dishId });
      return dish;
    } catch (error) {
      logger.error('Error deleting dish', { error: error.message });
      throw error;
    }
  }
}

module.exports = new DishService();
