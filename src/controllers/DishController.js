const DishService = require('../services/DishService');
const logger = require('../utils/logger');

class DishController {

    /**
     * Create a new dish
     * POST /api/dishes
     */
    async createDish(req, res, next) {
        try {
            // TODO: Handle image upload here later
            const dishData = req.body;

            // Basic validation
            if (!dishData.nom || !dishData.prix || !dishData.categorie_id) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'MISSING_FIELDS',
                        message: 'Name, price and category ID are required'
                    }
                });
            }

            const dish = await DishService.createDish(dishData);

            res.status(201).json({
                success: true,
                message: 'Dish created successfully',
                data: dish
            });
        } catch (error) {
            logger.error('Error creating dish', { error: error.message });
            next(error);
        }
    }

    /**
     * Get all dishes (admin view) or filtering by category
     * GET /api/dishes
     */
    async getDishes(req, res, next) {
        try {
            const { category_id } = req.query;
            let dishes;

            if (category_id) {
                dishes = await DishService.getDishesByCategory(category_id);
            } else {
                dishes = await DishService.getAllDishes();
            }

            res.status(200).json({
                success: true,
                count: dishes.length,
                data: dishes
            });
        } catch (error) {
            logger.error('Error getting dishes', { error: error.message });
            next(error);
        }
    }

    /**
     * Get single dish
     * GET /api/dishes/:id
     */
    async getDish(req, res, next) {
        try {
            const { id } = req.params;
            const dish = await DishService.getDishById(id);

            res.status(200).json({
                success: true,
                data: dish
            });
        } catch (error) {
            logger.error('Error getting dish', { error: error.message });
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: 'Dish not found' });
            }
            next(error);
        }
    }

    /**
     * Update dish
     * PUT /api/dishes/:id
     */
    async updateDish(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const dish = await DishService.updateDish(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Dish updated successfully',
                data: dish
            });
        } catch (error) {
            logger.error('Error updating dish', { error: error.message });
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: 'Dish not found' });
            }
            next(error);
        }
    }

    /**
     * Toggle availability
     * PATCH /api/dishes/:id/availability
     */
    async toggleAvailability(req, res, next) {
        try {
            const { id } = req.params;
            const dish = await DishService.toggleAvailability(id);

            res.status(200).json({
                success: true,
                message: `Dish is now ${dish.disponible ? 'available' : 'unavailable'}`,
                data: {
                    _id: dish._id,
                    nom: dish.nom,
                    disponible: dish.disponible
                }
            });
        } catch (error) {
            logger.error('Error toggling availability', { error: error.message });
            next(error);
        }
    }

    /**
     * Delete dish
     * DELETE /api/dishes/:id
     */
    async deleteDish(req, res, next) {
        try {
            const { id } = req.params;
            await DishService.deleteDish(id);

            res.status(200).json({
                success: true,
                message: 'Dish deleted successfully'
            });
        } catch (error) {
            logger.error('Error deleting dish', { error: error.message });
            next(error);
        }
    }
}

module.exports = new DishController();
