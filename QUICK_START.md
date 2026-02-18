# Quick Start Guide - Digital Menu Access

This guide shows how to implement and test the first feature: **Client QR Code Scanning → Digital Menu Access**

## Architecture

```
Client App
    ↓
Scans QR Code
    ↓
POST /api/sessions (with qr_code)
    ↓
Backend creates ClientSession
    ↓
Returns session_id
    ↓
GET /api/menu (with session_id)
    ↓
Returns complete menu with categories and dishes
```

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0-alpine

# Or using Docker Compose
docker-compose up -d mongodb
```

### 3. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` if needed (default settings should work for local development).

### 4. Seed Database
```bash
npm run seed
```

This creates:
- 5 tables (Table 1-5) with QR codes
- 1 menu with 4 categories (Entrées, Plats Principaux, Desserts, Boissons)
- 10 dishes with prices

**Output example:**
```
Test QR codes:
Table 1: table_1_1706256600000
Table 2: table_2_1706256600001
Table 3: table_3_1706256600002
Table 4: table_4_1706256600003
Table 5: table_5_1706256600004
```

### 5. Start Server
```bash
npm run dev
```

Server will run on `http://localhost:3000`

---

## Testing the Feature

### Step 1: Get the Menu (Empty Session)
```bash
curl http://localhost:3000/api/menu
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "...",
        "nom": "Entrées",
        "ordre_affichage": 0,
        "dishes": [
          {
            "_id": "...",
            "nom": "Salade César",
            "description": "Salade fraîche avec croutons",
            "prix": 8.99,
            "disponible": true,
            "image_url": null
          }
        ]
      }
    ],
    "totalDishes": 10
  }
}
```

### Step 2: Create Session from QR Code
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "table_1_1706256600000"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "table_id": "507f1f77bcf86cd799439011",
    "started_at": "2024-01-26T10:30:00.000Z"
  },
  "message": "Session created successfully"
}
```

**Save the `session_id` for next steps!**

### Step 3: Validate Session
```bash
curl http://localhost:3000/api/sessions/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "table_id": "507f1f77bcf86cd799439011",
    "table_number": 1,
    "started_at": "2024-01-26T10:30:00.000Z"
  },
  "message": "Session is valid"
}
```

### Step 4: Get Menu (With Valid Session)
```bash
curl http://localhost:3000/api/menu
```

Same response as Step 1 - the menu is available to all valid sessions.

### Step 5: End Session
```bash
curl -X DELETE http://localhost:3000/api/sessions/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "message": "Session ended successfully"
}
```

---

## Testing with Invalid QR Code

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "invalid_qr_code"}'
```

**Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Invalid QR code or table is inactive"
  }
}
```

---

## Testing with Empty Database

If you don't run the seed script, the API will still work:

```bash
curl http://localhost:3000/api/menu
```

**Response (Empty Menu):**
```json
{
  "success": true,
  "data": {
    "categories": [],
    "totalDishes": 0
  },
  "message": "Menu retrieved successfully"
}
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create session from QR code |
| GET | `/api/sessions/:session_id` | Validate session |
| DELETE | `/api/sessions/:session_id` | End session |
| GET | `/api/menu` | Get complete menu |
| GET | `/api/menus/:id` | Get menu by ID |
| POST | `/api/menus` | Create menu |
| PUT | `/api/menus/:id` | Update menu |
| DELETE | `/api/menus/:id` | Delete menu |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── SessionController.js     # Session logic
│   │   └── MenuController.js        # Menu logic
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── models/
│   │   ├── Table.js                 # Table schema
│   │   ├── ClientSession.js         # Session schema
│   │   ├── Menu.js                  # Menu schema
│   │   ├── Category.js              # Category schema
│   │   ├── Dish.js                  # Dish schema
│   │   └── User.js                  # User schema
│   ├── routes/
│   │   ├── health.js
│   │   ├── sessions.js              # Session routes
│   │   └── menu.js                  # Menu routes
│   ├── services/
│   │   ├── SessionService.js        # Session business logic
│   │   ├── MenuService.js           # Menu business logic
│   │   ├── DishService.js           # Dish business logic
│   │   └── TableService.js          # Table business logic
│   ├── utils/
│   │   └── logger.js                # Logging utility
│   └── index.js                     # Main app file
├── seeds/
│   └── seedData.js                  # Database seeding
├── .env.example
├── .env.local
├── package.json
└── README.md
```

---

## Next Steps

1. **Add Order Management** - Allow clients to place orders
2. **Add WebSocket Notifications** - Real-time order updates
3. **Add Authentication** - User login and roles
4. **Add Payment** - Order payment processing
5. **Add Statistics** - Sales reports and analytics

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is running
```bash
docker ps  # Check if MongoDB container is running
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Change PORT in `.env.local` or kill the process using port 3000

### Seed Script Fails
```
Error: Cannot find module 'mongoose'
```

**Solution:** Install dependencies
```bash
npm install
```

---

## Performance Notes

- Menu is cached in memory (can be optimized with Redis)
- Sessions auto-expire after 24 hours
- Database indexes are created for fast queries
- Logging is structured for easy debugging

---

## Security Notes

- QR codes are unique per table
- Sessions are validated on each request
- CORS is configured for mobile app domain
- Error messages don't expose sensitive data
- All inputs are validated

---

For more details, see:
- `API_ENDPOINTS.md` - Complete API documentation
- `README.md` - General project information
- `../DEPLOYMENT.md` - Production deployment guide
