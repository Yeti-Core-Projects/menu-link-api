const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management (Admin)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories (optionally filter by menu_id)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: menu_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_id
 *               - nom
 *             properties:
 *               menu_id:
 *                 type: string
 *               nom:
 *                 type: string
 *               ordre_affichage:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Category created
 */
router.get('/', CategoryController.listCategories.bind(CategoryController));
router.post('/', CategoryController.createCategory.bind(CategoryController));

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update category
 *     tags: [Categories]
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
 *               ordre_affichage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     summary: Delete category (must be empty)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       400:
 *         description: Cannot delete if not empty
 */
router.get('/:id', CategoryController.getCategory.bind(CategoryController));
router.put('/:id', CategoryController.updateCategory.bind(CategoryController));
router.delete('/:id', CategoryController.deleteCategory.bind(CategoryController));

module.exports = router;
