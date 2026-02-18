const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu retrieval and management
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get complete menu with all categories and dishes
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: The complete active menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Menu'
 */
router.get('/', MenuController.getCompleteMenu.bind(MenuController));

/**
 * GET /api/menus/:id
 * Get menu by ID
 */
router.get('/:id', MenuController.getMenuById.bind(MenuController));

/**
 * POST /api/menus
 * Create new menu
 */
router.post('/', MenuController.createMenu.bind(MenuController));

/**
 * PUT /api/menus/:id
 * Update menu
 */
router.put('/:id', MenuController.updateMenu.bind(MenuController));

/**
 * DELETE /api/menus/:id
 * Delete menu
 */
router.delete('/:id', MenuController.deleteMenu.bind(MenuController));

module.exports = router;
