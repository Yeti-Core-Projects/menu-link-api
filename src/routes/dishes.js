const express = require('express');
const router = express.Router();
const DishController = require('../controllers/DishController');

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: Dish management (Admin)
 */

/**
 * @swagger
 * /dishes:
 *   get:
 *     summary: List all dishes (optionally filter by category)
 *     tags: [Dishes]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: List of dishes
 *   post:
 *     summary: Create a new dish
 *     tags: [Dishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prix
 *               - categorie_id
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               categorie_id:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dish created successfully
 */
router.get('/', DishController.getDishes.bind(DishController));
router.post('/', DishController.createDish.bind(DishController));

/**
 * @swagger
 * /dishes/{id}:
 *   get:
 *     summary: Get dish details
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish details
 *       404:
 *         description: Dish not found
 *   put:
 *     summary: Update dish details
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               disponible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Dish updated successfully
 *   delete:
 *     summary: Delete a dish
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish deleted successfully
 */
router.get('/:id', DishController.getDish.bind(DishController));
router.put('/:id', DishController.updateDish.bind(DishController));
router.delete('/:id', DishController.deleteDish.bind(DishController));

/**
 * @swagger
 * /dishes/{id}/availability:
 *   patch:
 *     summary: Toggle dish availability (In Stock / Out of Stock)
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability toggled
 */
router.patch('/:id/availability', DishController.toggleAvailability.bind(DishController));

module.exports = router;
