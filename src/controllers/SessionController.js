const SessionService = require('../services/SessionService');
const logger = require('../utils/logger');

const MenuService = require('../services/MenuService');

class SessionController {
  /**
   * Create session from QR code scan
   * POST /api/sessions
   */
  async createSessionFromQRCode(req, res, next) {
    try {
      const { qr_code } = req.body;

      if (!qr_code) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_QR_CODE',
            message: 'QR code is required',
          },
        });
      }

      // 1. Create the session
      const session = await SessionService.createSessionFromQRCode(qr_code);

      // 2. Fetch the menu
      // In a real multi-restaurant app, we would fetch the menu linked to this specific table/restaurant
      const menu = await MenuService.getCompleteMenu();

      res.status(201).json({
        success: true,
        data: {
          session: {
            session_id: session.session_id,
            table_id: session.table_id,
            started_at: session.started_at,
          },
          menu: menu, // Include the full menu directly
        },
        message: 'Session created and menu retrieved successfully',
      });
    } catch (error) {
      logger.error('Error in createSessionFromQRCode', { error: error.message });
      next(error);
    }
  }

  /**
   * Validate session
   * GET /api/sessions/:session_id
   */
  async validateSession(req, res, next) {
    try {
      const { session_id } = req.params;

      const session = await SessionService.validateSession(session_id);

      res.status(200).json({
        success: true,
        data: {
          session_id: session.session_id,
          table_id: session.table_id,
          table_number: session.table_id.numero,
          started_at: session.started_at,
        },
        message: 'Session is valid',
      });
    } catch (error) {
      logger.error('Error in validateSession', { error: error.message });
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_SESSION',
            message: error.message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * End session
   * DELETE /api/sessions/:session_id
   */
  async endSession(req, res, next) {
    try {
      const { session_id } = req.params;

      await SessionService.endSession(session_id);

      res.status(200).json({
        success: true,
        message: 'Session ended successfully',
      });
    } catch (error) {
      logger.error('Error in endSession', { error: error.message });
      next(error);
    }
  }
}

module.exports = new SessionController();
