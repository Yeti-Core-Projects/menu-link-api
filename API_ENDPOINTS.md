# API Endpoints Documentation

## Base URL
```
http://localhost:3000/api
```

## Health Check

### Check Server Status
```
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-26T10:30:00.000Z"
}
```

---

## Sessions

### Create Session from QR Code
Scan a QR code to create a client session and access the menu.

```
POST /sessions
Content-Type: application/json

{
  "qr_code": "table_1_1706256600000"
}
```

**Response (201):**
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

**Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "MISSING_QR_CODE",
    "message": "QR code is required"
  }
}
```

**Error (404):**
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

### Validate Session
Check if a session is still valid.

```
GET /sessions/:session_id
```

**Response (200):**
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

**Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_SESSION",
    "message": "Invalid or expired session"
  }
}
```

---

### End Session
Close a client session.

```
DELETE /sessions/:session_id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Session ended successfully"
}
```

---

## Menu

### Get Complete Menu
Get all categories and dishes. Returns empty arrays if no data exists.

```
GET /menu
```

**Response (200) - With Data:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "nom": "Entrées",
        "ordre_affichage": 0,
        "dishes": [
          {
            "_id": "507f1f77bcf86cd799439012",
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
  },
  "message": "Menu retrieved successfully"
}
```

**Response (200) - Empty Menu:**
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

### Get Menu by ID
Get a specific menu.

```
GET /menus/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Menu Principal",
    "actif": true,
    "gestionnaire_id": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Admin Gestionnaire",
      "email": "gestionnaire@restaurant.com",
      "role": "GESTIONNAIRE"
    }
  }
}
```

---

### Create Menu
Create a new menu (requires gestionnaire_id).

```
POST /menus
Content-Type: application/json

{
  "nom": "Menu du Jour",
  "gestionnaire_id": "507f1f77bcf86cd799439010"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Menu du Jour",
    "actif": true,
    "gestionnaire_id": "507f1f77bcf86cd799439010"
  },
  "message": "Menu created successfully"
}
```

---

### Update Menu
Update an existing menu.

```
PUT /menus/:id
Content-Type: application/json

{
  "nom": "Menu Spécial",
  "actif": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Menu Spécial",
    "actif": false,
    "gestionnaire_id": "507f1f77bcf86cd799439010"
  },
  "message": "Menu updated successfully"
}
```

---

### Delete Menu
Delete a menu.

```
DELETE /menus/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Menu deleted successfully"
}
```

---

## Testing the API

### 1. Seed the Database
```bash
node src/seeds/seedData.js
```

This will create:
- 5 tables with QR codes
- 1 menu with 4 categories
- 10 dishes

### 2. Get the Menu
```bash
curl http://localhost:3000/api/menu
```

### 3. Create a Session
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "table_1_1706256600000"}'
```

Replace `table_1_1706256600000` with an actual QR code from the seed output.

### 4. Validate the Session
```bash
curl http://localhost:3000/api/sessions/550e8400-e29b-41d4-a716-446655440000
```

Replace the session_id with the one from step 3.

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| MISSING_QR_CODE | 400 | QR code is required |
| MISSING_FIELDS | 400 | Required fields are missing |
| INVALID_SESSION | 401 | Session is invalid or expired |
| NOT_FOUND | 404 | Resource not found |
| INTERNAL_SERVER_ERROR | 500 | Server error |

---

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```
