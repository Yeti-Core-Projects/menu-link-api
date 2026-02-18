const CategoryService = require('../services/CategoryService');
const logger = require('../utils/logger');

class CategoryController {

    /**
     * Create new category
     * POST /api/categories
     */
    async createCategory(req, res, next) {
        try {
            const { menu_id, nom, ordre_affichage } = req.body;

            if (!menu_id || !nom) {
                return res.status(400).json({
                    success: false,
                    error: 'menu_id and nom are required'
                });
            }

            const category = await CategoryService.createCategory(menu_id, nom, ordre_affichage);

            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created'
            });
        } catch (error) {
            logger.error('Error creating category', { error: error.message });
            next(error);
        }
    }

    /**
     * List categories
     * GET /api/categories?menu_id=...
     */
    async listCategories(req, res, next) {
        try {
            const { menu_id } = req.query;
            const categories = await CategoryService.listCategories(menu_id);

            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });
        } catch (error) {
            logger.error('Error listing categories', { error: error.message });
            next(error);
        }
    }

    /**
     * Get category
     * GET /api/categories/:id
     */
    async getCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryService.getCategoryById(id);

            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: 'Category not found' });
            }
            next(error);
        }
    }

    /**
     * Update category
     * PUT /api/categories/:id
     */
    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryService.updateCategory(id, req.body);

            res.status(200).json({
                success: true,
                data: category,
                message: 'Category updated'
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: 'Category not found' });
            }
            next(error);
        }
    }

    /**
     * Delete category
     * DELETE /api/categories/:id
     */
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(id);

            res.status(200).json({
                success: true,
                message: 'Category deleted'
            });
        } catch (error) {
            logger.error('Error deleting category', { error: error.message });
            if (error.message.includes('Cannot delete')) {
                return res.status(400).json({ success: false, error: error.message });
            }
            next(error);
        }
    }
}

module.exports = new CategoryController();
