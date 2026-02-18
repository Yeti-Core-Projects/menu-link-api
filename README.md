# Restaurant Management API

Backend API for the restaurant management application built with Express.js and MongoDB.

## 📚 Documentation API

**Documentation interactive Swagger UI disponible en ligne:**
- 🌐 Production: https://menu-link-api.onrender.com/api-docs
- 🏠 Local: http://localhost:3000/api-docs

Pour plus de détails, consultez:
- `QUICK_START.md` - Guide de démarrage rapide
- `API_DOCUMENTATION.md` - Documentation complète de l'API
- `FRONTEND_INTEGRATION.md` - Guide d'intégration frontend
- `POUR_LE_DEV_FRONTEND.md` - Guide pour les développeurs frontend

## Features

- QR code-based table authentication
- Real-time order notifications via WebSocket
- Menu management (categories and dishes)
- Order management with status tracking
- Role-based access control
- Sales statistics and reporting
- Image upload for dishes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your configuration:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your MongoDB URI and other settings

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Testing

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Generate coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── index.js         # Main application file
├── tests/               # Test files
├── uploads/             # Uploaded files directory
├── .env.example         # Environment variables template
├── .env.local           # Local environment variables (not committed)
├── jest.config.js       # Jest configuration
└── package.json         # Project dependencies
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Tables (Coming soon)
- `POST /api/tables` - Create table
- `GET /api/tables` - List all tables
- `GET /api/tables/:id` - Get table details
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table

### Sessions (Coming soon)
- `POST /api/sessions` - Create session (QR code scan)
- `GET /api/sessions/:token` - Validate session
- `DELETE /api/sessions/:token` - End session

### Menu (Coming soon)
- `GET /api/menu` - Get complete menu
- `POST /api/categories` - Create category
- `GET /api/categories` - List categories
- `POST /api/dishes` - Create dish
- `GET /api/dishes` - List dishes

### Orders (Coming soon)
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### Statistics (Coming soon)
- `GET /api/statistics` - Get sales statistics

## Environment Variables

See `.env.example` for all available configuration options.

## Error Handling

All errors are returned in a consistent JSON format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## WebSocket Events (Coming soon)

- `order_created` - New order notification
- `order_status_updated` - Order status change notification

