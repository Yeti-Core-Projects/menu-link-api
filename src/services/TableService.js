const Table = require('../models/Table');
const QRCode = require('qrcode');
const logger = require('../utils/logger');

class TableService {
  /**
   * Create a new table with QR code
   */
  async createTable(numero) {
    try {
      // Check if table already exists
      const existingTable = await Table.findOne({ numero });
      if (existingTable) {
        throw new Error(`Table ${numero} already exists`);
      }

      // Generate QR code data (contains table ID for scanning)
      const qrCodeData = `table_${numero}_${Date.now()}`;

      // Create table
      const table = new Table({
        numero,
        qr_code: qrCodeData,
        active: true,
      });

      await table.save();
      logger.info('Table created', { numero, tableId: table._id });

      return table;
    } catch (error) {
      logger.error('Error creating table', { error: error.message, numero });
      throw error;
    }
  }

  /**
   * Get table by QR code
   */
  async getTableByQRCode(qr_code) {
    try {
      const table = await Table.findOne({ qr_code, active: true });
      if (!table) {
        throw new Error('Invalid QR code or table is inactive');
      }
      return table;
    } catch (error) {
      logger.error('Error getting table by QR code', { error: error.message });
      throw error;
    }
  }

  /**
   * Get table by ID
   */
  async getTableById(tableId) {
    try {
      const table = await Table.findById(tableId);
      if (!table) {
        throw new Error('Table not found');
      }
      return table;
    } catch (error) {
      logger.error('Error getting table by ID', { error: error.message, tableId });
      throw error;
    }
  }

  /**
   * Get all tables
   */
  async getAllTables() {
    try {
      const tables = await Table.find().sort({ numero: 1 });
      return tables;
    } catch (error) {
      logger.error('Error getting all tables', { error: error.message });
      throw error;
    }
  }

  /**
   * Update table
   */
  async updateTable(tableId, updateData) {
    try {
      const table = await Table.findByIdAndUpdate(tableId, updateData, { new: true });
      if (!table) {
        throw new Error('Table not found');
      }
      logger.info('Table updated', { tableId });
      return table;
    } catch (error) {
      logger.error('Error updating table', { error: error.message, tableId });
      throw error;
    }
  }

  /**
   * Delete table
   */
  async deleteTable(tableId) {
    try {
      const table = await Table.findByIdAndDelete(tableId);
      if (!table) {
        throw new Error('Table not found');
      }
      logger.info('Table deleted', { tableId });
      return table;
    } catch (error) {
      logger.error('Error deleting table', { error: error.message, tableId });
      throw error;
    }
  }

  /**
   * Generate QR code image
   */
  async generateQRCodeImage(qrCodeData) {
    try {
      const qrImage = await QRCode.toDataURL(qrCodeData);
      return qrImage;
    } catch (error) {
      logger.error('Error generating QR code image', { error: error.message });
      throw error;
    }
  }
}

module.exports = new TableService();
