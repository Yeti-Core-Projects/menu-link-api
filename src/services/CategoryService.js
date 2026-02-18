const Category = require('../models/Category');
const Dish = require('../models/Dish');
const logger = require('../utils/logger');

class CategoryService {

    /**
     * Create a new category
     */
    async createCategory(menuId, nom, ordre = 0) {
        try {
            const category = new Category({
                menu_id: menuId,
                nom,
                ordre_affichage: ordre
            });
            await category.save();
            logger.info('Category created', { categoryId: category._id, nom });
            return category;
        } catch (error) {
            logger.error('Error creating category', { error: error.message });
            throw error;
        }
    }

    /**
     * Get category by ID
     */
    async getCategoryById(categoryId) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        } catch (error) {
            logger.error('Error getting category', { error: error.message });
            throw error;
        }
    }

    /**
     * Update category
     */
    async updateCategory(categoryId, updateData) {
        try {
            const category = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
            if (!category) {
                throw new Error('Category not found');
            }
            logger.info('Category updated', { categoryId });
            return category;
        } catch (error) {
            logger.error('Error updating category', { error: error.message });
            throw error;
        }
    }

    /**
     * Delete category (and optionally dishes)
     */
    async deleteCategory(categoryId) {
        try {
            // Check if dishes exist
            const dishesCount = await Dish.countDocuments({ categorie_id: categoryId });
            if (dishesCount > 0) {
                throw new Error(`Cannot delete category: contains ${dishesCount} dishes. Delete them first.`);
            }

            const category = await Category.findByIdAndDelete(categoryId);
            if (!category) {
                throw new Error('Category not found');
            }
            logger.info('Category deleted', { categoryId });
            return category;
        } catch (error) {
            logger.error('Error deleting category', { error: error.message });
            throw error;
        }
    }

    /**
     * List all categories (optionally for a specific menu)
     */
    async listCategories(menuId) {
        try {
            const query = menuId ? { menu_id: menuId } : {};
            const categories = await Category.find(query).sort({ ordre_affichage: 1 });
            return categories;
        } catch (error) {
            logger.error('Error listing categories', { error: error.message });
            throw error;
        }
    }
}

module.exports = new CategoryService();
