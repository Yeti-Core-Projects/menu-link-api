const TableService = require('../services/TableService');
const logger = require('../utils/logger');

class TableController {

    /**
     * Create table
     * POST /api/tables
     */
    async createTable(req, res, next) {
        try {
            const { tableNumber } = req.body;
            if (!tableNumber) {
                return res.status(400).json({ success: false, error: 'tableNumber is required' });
            }

            const table = await TableService.createTable(tableNumber);

            res.status(201).json({
                success: true,
                data: table,
                message: 'Table created'
            });
        } catch (error) {
            if (error.message.includes('already exists')) {
                return res.status(409).json({ success: false, error: error.message });
            }
            next(error);
        }
    }

    /**
     * List tables
     * GET /api/tables
     */
    async listTables(req, res, next) {
        try {
            const tables = await TableService.getAllTables();
            res.status(200).json({
                success: true,
                count: tables.length,
                data: tables
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get table QR Code (Image Base64)
     * GET /api/tables/:id/qr
     */
    async getTableQRCode(req, res, next) {
        try {
            const { id } = req.params;
            const table = await TableService.getTableById(id);

            // Generate QR Code image
            const qrImage = await TableService.generateQRCodeImage(table.qr_code);

            // Return as JSON with Base64 or directly as image?
            // Let's return JSON for API consistency
            res.status(200).json({
                success: true,
                data: {
                    tableNumber: table.numero,
                    qrCodeString: table.qr_code,
                    qrImageBase64: qrImage
                }
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: 'Table not found' });
            }
            next(error);
        }
    }

    /**
     * Delete table
     * DELETE /api/tables/:id
     */
    async deleteTable(req, res, next) {
        try {
            const { id } = req.params;
            await TableService.deleteTable(id);

            res.status(200).json({
                success: true,
                message: 'Table deleted'
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: 'Table not found' });
            }
            next(error);
        }
    }
}

module.exports = new TableController();
