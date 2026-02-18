const MenuService = require('../services/MenuService');
const logger = require('../utils/logger');

class MenuController {
  /**
   * Get complete menu with all categories and dishes
   * GET /api/menu
   */
  async getCompleteMenu(req, res, next) {
    try {
      const menu = await MenuService.getCompleteMenu();

      res.status(200).json({
        success: true,
        data: menu,
        message: 'Menu retrieved successfully',
      });
    } catch (error) {
      logger.error('Error in getCompleteMenu', { error: error.message });
      next(error);
    }
  }

  /**
   * Get menu by ID
   * GET /api/menus/:id
   */
  async getMenuById(req, res, next) {
    try {
      const { id } = req.params;
      const menu = await MenuService.getMenuById(id);

      res.status(200).json({
        success: true,
        data: menu,
      });
    } catch (error) {
      logger.error('Error in getMenuById', { error: error.message });
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * Create new menu
   * POST /api/menus
   */
  async createMenu(req, res, next) {
    try {
      const { nom, gestionnaire_id } = req.body;

      if (!nom || !gestionnaire_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'nom and gestionnaire_id are required',
          },
        });
      }

      const menu = await MenuService.createMenu(nom, gestionnaire_id);

      res.status(201).json({
        success: true,
        data: menu,
        message: 'Menu created successfully',
      });
    } catch (error) {
      logger.error('Error in createMenu', { error: error.message });
      next(error);
    }
  }

  /**
   * Update menu
   * PUT /api/menus/:id
   */
  async updateMenu(req, res, next) {
    try {
      const { id } = req.params;
      const menu = await MenuService.updateMenu(id, req.body);

      res.status(200).json({
        success: true,
        data: menu,
        message: 'Menu updated successfully',
      });
    } catch (error) {
      logger.error('Error in updateMenu', { error: error.message });
      next(error);
    }
  }

  /**
   * Delete menu
   * DELETE /api/menus/:id
   */
  async deleteMenu(req, res, next) {
    try {
      const { id } = req.params;
      await MenuService.deleteMenu(id);

      res.status(200).json({
        success: true,
        message: 'Menu deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteMenu', { error: error.message });
      next(error);
    }
  }
}

module.exports = new MenuController();
