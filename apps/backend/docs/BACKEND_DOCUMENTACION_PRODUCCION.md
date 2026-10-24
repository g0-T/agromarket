# Backend Technical Documentation - JR Agro Marketplace

## 1. Executive Summary

This backend is designed to operate as the business and data layer for the cattle marketplace. It implements authentication, product management, commercial transactions, disputes, push notifications, seller applications, and file attachments.

Core stack:
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Better Auth for authentication
- Multer for file uploads
- Socket.io for real-time events
- Sentry for error monitoring
- In-memory cache for products (internal implementation)

Expected base URL:
- Development: http://localhost:5000
- Production: as defined in BACKEND_URL

Main base routes:
- /api/auth
- /api/products
- /api/transactions
- /api/users
- /api/seller-applications
- /api/favorites
- /api/notifications
- /api/admin
- /api/currency

---

## 2. Project Architecture

### 2.1 Architecture Pattern

The backend follows a domain-modular approach with a clear separation of layers:

1. Entry layer (Routes / Middlewares)
   - Receives HTTP requests.
   - Applies validation, authentication, rate limiting, and file handling.

2. Controller layer
   - Coordinates request logic.
   - Receives request data, delegates to services, and builds the HTTP response.

3. Business layer (Services)
   - Contains business rules and reusable logic.
   - Communicates with Prisma for data access.

4. Persistence layer (Prisma + PostgreSQL)
   - Defines the data model and database connection.

5. Utility layer (Utils)
   - Storage, encryption, email, sockets, file helpers, DB session helpers, etc.

### 2.2 Request Flow

```text
Client
  -> Express App
  -> Middleware (CORS, Helmet, HPP, Compression, Auth, Rate Limit)
  -> Router
  -> Controller
  -> Service
  -> Prisma / PostgreSQL
  -> JSON response or HTTP status
```

### 2.3 Folder Structure

```text
apps/backend/
  docs/                                # documentation
  prisma/
    schema.prisma                      # Prisma data model
    migrations/                        # SQL migrations
  src/
    auth.ts                            # Better Auth configuration
    index.ts                           # Express server bootstrap
    controllers/                       # HTTP controllers
    routes/                            # route definitions
    services/                          # business logic
    middlewares/                       # auth, validation, rate limit, error handler
    validators/                        # Zod schemas for request validation
    schemas/                           # additional domain schemas
    utils/                             # helpers for prisma, crypto, storage, sockets, etc.
    config/                            # environment configuration
    logger/                            # centralized logging
    templates/                         # email/alert templates
    types/                             # TypeScript types
    constants/                         # business constants
```

### 2.4 Layer Responsibilities

#### Routes
Located in src/routes/.
Responsible for:
- Mapping URLs to controllers.
- Applying authentication and validation middlewares.
- Supporting multipart/form-data uploads.

#### Controllers
Located in src/controllers/.
Responsible for:
- Receiving request/response objects.
- Validating user context.
- Orchestrating operations and returning JSON payloads.

#### Services
Located in src/services/.
Responsible for:
- Complex business rules.
- Shared logic for products, transactions, seller applications, notifications, OTP, currency, etc.

#### Middlewares
Located in src/middlewares/.
Include:
- auth.middleware.ts: authentication based on Better Auth / bearer sessions.
- admin.middleware.ts: role-based access control.
- validate.middleware.ts: request body validation with Zod.
- rate-limit.middleware.ts: abuse protection.
- error-handler.middleware.ts: centralized error handling.

#### Utils
Located in src/utils/.
Include:
- prisma.ts: Prisma singleton client.
- storage.ts: file storage integration.
- encryption.ts: encryption for sensitive data like addresses and messages.
- socket.ts: Socket.io.
- email.ts and sms.ts: notification and OTP delivery.

---

## 3. Database Design

The database is modeled with Prisma and runs on PostgreSQL.

### 3.1 Overall Model

Main relationships:
- A user can have many products, transactions, seller applications, favorites, push tokens, notifications, and messages.
- A product belongs to a seller and can have multiple transactions and attachments.
- A transaction links buyer, seller, and product.
- A dispute belongs to a transaction and can include attachments.
- Attachments can be linked to products, transactions, disputes, or seller applications.

### 3.2 Data Dictionary

#### User
- id: String (PK, cuid)
- email: String (unique)
- name: String?
- createdAt: DateTime
- updatedAt: DateTime
- emailVerified: Boolean (default false)
- phone: String? (unique)
- phoneVerified: Boolean (default false)
- lastOtpSent: DateTime?
- image: String?
- role: String (default "buyer")
- Relations: products, sellerApplications, transactions, favorites, notifications, pushTokens, sessions, accounts

#### Account
- id: String (PK)
- userId: String (FK -> User.id)
- providerId: String?
- accountId: String
- type: String?
- OAuth session tokens and metadata
- Constraints: unique(providerId, accountId)

#### Session
- id: String (PK)
- token: String (unique)
- userId: String (FK -> User.id)
- expiresAt: DateTime
- ipAddress: String?
- userAgent: String?

#### VerificationToken
- identifier: String
- token: String (unique)
- expires: DateTime
- createdAt: DateTime
- Constraints: unique(identifier, token)

#### Verification
- id: String (PK)
- identifier: String (unique)
- value: String
- expiresAt: DateTime
- createdAt/updatedAt

#### SellerApplication
- id: String (PK)
- userId: String (FK -> User.id)
- status: String (default "pending")
- reason: String?
- adminNotes: String?
- submittedAt: DateTime
- reviewedAt: DateTime?
- farmLocationLat: String?
- farmLocationLng: String?
- farmLocationAddress: String?
- Relations: user, attachments
- Index: [userId, status]

#### Product
- id: Int (PK, auto increment)
- title: String
- description: String?
- price: Float
- currency: String (default "VES")
- category: String
- breed: String?
- type: String?
- weight: String?
- location: String?
- heads: Int?
- age: String?
- condition: String?
- verified: Boolean (default false)
- img: String?
- sellerId: String (FK -> User.id)
- createdAt/updatedAt
- Relations: seller, transactions, attachments, favorites
- Indexes: sellerId, createdAt/id, category/createdAt

#### Favorite
- id: String (PK)
- userId: String (FK -> User.id)
- productId: Int (FK -> Product.id)
- createdAt: DateTime
- Constraint: unique(userId, productId)

#### Transaction
- id: String (PK)
- productId: Int (FK -> Product.id)
- buyerId: String (FK -> User.id)
- sellerId: String (FK -> User.id)
- amount: Float
- currency: String (default "VES")
- status: String (default "pending")
- buyerProof: String?
- sellerProof: String?
- adminNotes: String?
- buyerDeliveryLat: String?
- buyerDeliveryLng: String?
- buyerDeliveryAddress: String?
- deliveryToken: String?
- deliveryTokenExpiresAt: DateTime?
- locationExpiresAt: DateTime?
- createdAt/updatedAt
- Relations: product, buyer, seller, chatMessages, attachments, disputes
- Expected statuses: pending, paid, in_transit, completed, disputed

#### Dispute
- id: String (PK)
- transactionId: String (FK -> Transaction.id)
- initiatorId: String (FK -> User.id)
- reason: String
- status: String (default "open")
- adminNotes: String?
- createdAt/updatedAt

#### ChatMessage
- id: String (PK)
- transactionId: String (FK -> Transaction.id)
- senderId: String (FK -> User.id)
- text: String?
- attachment: String?
- createdAt

#### Attachment
- id: String (PK)
- type: String
- url: String
- filename: String?
- mimeType: String?
- uploaderId: String? (FK -> User.id)
- transactionId: String? (FK -> Transaction.id)
- productId: Int? (FK -> Product.id)
- sellerApplicationId: String? (FK -> SellerApplication.id)
- disputeId: String? (FK -> Dispute.id)
- createdAt

#### AppConfig
- id: String (PK)
- key: String (unique)
- value: Float
- updatedAt
- Mapped to app_configs

#### PushToken
- id: String (PK)
- token: String (unique)
- platform: String
- userId: String (FK -> User.id)
- createdAt/updatedAt

#### Notification
- id: String (PK)
- title: String
- body: String
- data: String (default "{}")
- type: String (default "push")
- read: Boolean (default false)
- userId: String (FK -> User.id)
- createdAt/updatedAt

#### NotificationSettings
- id: String (PK)
- userId: String (unique, FK -> User.id)
- pushEnabled: Boolean (default true)
- emailEnabled: Boolean (default false)
- createdAt/updatedAt

---

## 4. API Documentation

### 4.1 General Conventions

Common headers:
- Authorization: Bearer <token> for authenticated routes
- Content-Type: application/json for JSON payloads
- For file upload: multipart/form-data

Standard response format:
```json
{
  "success": true,
  "data": {},
  "message": "Optional"
}
```

Error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### 4.2 Health Check

#### GET /health
- No authentication required
- Response 200:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "env": "production"
}
```

### 4.3 Authentication

#### POST /api/auth/phone/send-otp
- Headers: Content-Type: application/json
- Body:
```json
{
  "phone": "+584141234567"
}
```
- Response 200:
```json
{
  "success": true,
  "message": "Código enviado"
}
```

#### POST /api/auth/phone/verify-otp
- Headers: Content-Type: application/json
- Body:
```json
{
  "phone": "+584141234567",
  "otp": "OTP_GENERADO_POR_SISTEMA"
}
```
- Response 200:
```json
{
  "success": true,
  "message": "Teléfono verificado",
  "verifiedAt": "2026-06-27T00:00:00.000Z"
}
```

#### GET /api/auth/verify
- Headers: Authorization: Bearer <token>
- Response 200:
```json
{
  "success": true,
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "role": "buyer"
  }
}
```

> Note: the backend also exposes the full Better Auth flow under /api/auth/* for registration, login, logout, email verification, and sessions.

### 4.4 Products

#### GET /api/products
- No authentication required
- Optional query params:
  - category
  - search
  - page
  - limit
  - excludeSellerId
  - includeTotal
  - cursorId
  - cursorCreatedAt
- Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Novillo",
      "price": 2500000,
      "currency": "VES",
      "category": "Ganado",
      "location": "Barinas",
      "sellerId": "user_123"
    }
  ],
  "total": 42,
  "nextCursor": {
    "createdAt": "2026-06-27T00:00:00.000Z",
    "id": 10
  }
}
```

#### GET /api/products/:id
- No authentication required
- Response 200:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Novillo",
    "price": 2500000,
    "currency": "VES",
    "description": "Lote seleccionado",
    "seller": {
      "id": "user_123",
      "name": "Juan Pérez"
    }
  }
}
```

#### POST /api/products
- Headers: Authorization: Bearer <token>
- Body: multipart/form-data
- Expected JSON fields:
```json
{
  "title": "Novillo",
  "description": "Lote en excelente estado",
  "price": 2500000,
  "currency": "VES",
  "category": "Ganado",
  "breed": "Brahman",
  "type": "Machos",
  "weight": "350 kg",
  "location": "Barinas",
  "heads": 3,
  "age": "2 años",
  "condition": "Bueno"
}
```
- Files: image or video (up to 5)
- Response 201:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Novillo",
    "price": 2500000,
    "currency": "VES"
  }
}
```

#### PUT /api/products/:id
- Headers: Authorization: Bearer <token>
- Body: multipart/form-data
- Expected fields: same as create, partial
- Files: images/videos (up to 10)
- Response 200:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Novillo actualizado"
  }
}
```

#### DELETE /api/products/:id
- Headers: Authorization: Bearer <token>
- Response 204 (no content)

### 4.5 Transactions

#### POST /api/transactions
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "productId": 1,
  "amount": 2500000,
  "currency": "VES",
  "buyerDeliveryAddress": "Caracas, Avenida principal",
  "buyerDeliveryLat": "10.4806",
  "buyerDeliveryLng": "-66.9036"
}
```
- Response 201 or 200:
```json
{
  "success": true,
  "data": {
    "id": "tx_123",
    "status": "pending",
    "productId": 1,
    "buyerId": "buyer_1",
    "sellerId": "seller_1"
  }
}
```

#### GET /api/transactions
- Headers: Authorization: Bearer <token>
- Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": "tx_123",
      "status": "paid",
      "product": {},
      "buyer": {},
      "seller": {}
    }
  ]
}
```

#### GET /api/transactions/:id
- Headers: Authorization: Bearer <token>
- Response 200: full transaction detail with messages and attachments

#### POST /api/transactions/:id/chat
- Headers: Authorization: Bearer <token>
- Body: multipart/form-data or JSON
```json
{
  "text": "Hola, ¿cómo va la entrega?"
}
```
- Optional file: attachment
- Response 201:
```json
{
  "success": true,
  "data": {
    "id": "msg_1",
    "text": "Hola, ¿cómo va la entrega?",
    "senderId": "user_1"
  }
}
```

#### POST /api/transactions/:id/proof
- Headers: Authorization: Bearer <token>
- Body: multipart/form-data with field proof
- Response 200:
```json
{
  "success": true,
  "data": {
    "id": "tx_123",
    "status": "paid",
    "buyerProof": "https://..."
  }
}
```

#### POST /api/transactions/:id/delivery-location
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "buyerDeliveryAddress": "Caracas, Avenida principal",
  "buyerDeliveryLat": "10.4806",
  "buyerDeliveryLng": "-66.9036"
}
```
- Response 200:
```json
{
  "success": true,
  "data": {
    "id": "tx_123",
    "buyerDeliveryAddress": "Caracas, Avenida principal"
  }
}
```

#### POST /api/transactions/:id/send-lot
- Headers: Authorization: Bearer <token>
- Response 200: marks the transaction as in transit and generates a delivery token

#### POST /api/transactions/:id/verify-token
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "token": "TOKEN_GENERADO_POR_SISTEMA"
}
```
- Response 200: marks the transaction as completed

#### POST /api/transactions/:id/complete
- Headers: Authorization: Bearer <token>
- Response 200: completes the transaction if it is in status in_transit

#### POST /api/transactions/:id/dispute
- Headers: Authorization: Bearer <token>
- Body: multipart/form-data
```json
{
  "transactionId": "tx_123",
  "reason": "El lote no llegó en las condiciones acordadas"
}
```
- Optional photos: up to 3
- Response 201:
```json
{
  "success": true,
  "data": {
    "id": "dispute_1",
    "status": "open",
    "reason": "El lote no llegó en las condiciones acordadas"
  }
}
```

#### GET /api/transactions/disputes
- Headers: Authorization: Bearer <token>
- Response 200: list of authenticated user disputes

### 4.6 Seller Applications

#### POST /api/seller-applications
- Headers: Authorization: Bearer <token>
- Body: multipart/form-data
- Expected fields:
```json
{
  "reason": "Quiero vender ganado en el marketplace porque tengo experiencia y disponibilidad",
  "farmLocationLat": "10.4806",
  "farmLocationLng": "-66.9036",
  "farmLocationAddress": "Finca Los Cedros"
}
```
- Files: at least 2 documents (Cédula and Hierro)
- Response 201:
```json
{
  "success": true,
  "data": {
    "id": "app_123",
    "status": "pending",
    "reason": "Quiero vender ganado..."
  }
}
```

#### GET /api/seller-applications/me
- Headers: Authorization: Bearer <token>
- Response 200: current user application

#### GET /api/seller-applications
- Headers: Authorization: Bearer <token> + admin role
- Response 200: list of applications for admin review

#### PUT /api/seller-applications/:id/approve
- Headers: Authorization: Bearer <token> + admin role
- Body:
```json
{
  "notes": "Solicitud aprobada"
}
```
- Response 200: changes status to approved and updates user role to seller

#### PUT /api/seller-applications/:id/reject
- Headers: Authorization: Bearer <token> + admin role
- Body:
```json
{
  "notes": "Documentación incompleta",
  "isFinal": false
}
```
- Response 200: marks the application as rejected or blocked_from_applying

### 4.7 Users

#### GET /api/users/:id
- No authentication required
- Response 200:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "seller"
  }
}
```

#### PATCH /api/users/profile
- Headers: Authorization: Bearer <token>
- Body: multipart/form-data
```json
{
  "name": "Juan Pérez"
}
```
- Optional file: image (avatar)
- Response 200:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Juan Pérez",
    "image": "https://..."
  }
}
```

### 4.8 Favorites

#### GET /api/favorites
- Headers: Authorization: Bearer <token>
- Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": "fav_1",
      "productId": 1
    }
  ]
}
```

#### GET /api/favorites/:productId
- Headers: Authorization: Bearer <token>
- Response 200:
```json
{
  "success": true,
  "data": {
    "favorited": true
  }
}
```

#### POST /api/favorites/:productId
- Headers: Authorization: Bearer <token>
- Response 201:
```json
{
  "success": true,
  "data": {
    "id": "fav_1",
    "userId": "user_123",
    "productId": 1
  }
}
```

#### DELETE /api/favorites/:productId
- Headers: Authorization: Bearer <token>
- Response 200:
```json
{
  "success": true,
  "data": {
    "removed": true
  }
}
```

### 4.9 Notifications

#### POST /api/notifications/register-token
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "token": "expo_push_token",
  "platform": "android"
}
```
- Response 200: confirms push token registration

#### POST /api/notifications/unregister-token
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "token": "expo_push_token"
}
```

#### POST /api/notifications/send
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "title": "Nuevo mensaje",
  "body": "Tienes un mensaje nuevo",
  "data": { "type": "message" },
  "userId": "user_123"
}
```
- Response 200: sends a push notification to the specified user

#### POST /api/notifications/send-multiple
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "title": "Oferta especial",
  "body": "Hay nuevos lotes disponibles",
  "data": { "type": "promo" },
  "userIds": ["user_1", "user_2"]
}
```

#### GET /api/notifications/history/:userId
- Headers: Authorization: Bearer <token>
- Query params: page, limit
- Response 200: paginated list of notifications

#### PATCH /api/notifications/:id/read
- Headers: Authorization: Bearer <token>
- Response 200: marks the notification as read

#### PATCH /api/notifications/:userId/read-all
- Headers: Authorization: Bearer <token>
- Response 200: marks all notifications for the user as read

#### GET /api/notifications/settings/:userId
- Headers: Authorization: Bearer <token>
- Response 200: user notification preferences

#### PATCH /api/notifications/settings/:userId
- Headers: Authorization: Bearer <token>
- Body:
```json
{
  "pushEnabled": true,
  "emailEnabled": false
}
```

### 4.10 Admin

#### GET /api/admin/transactions
- Headers: Authorization: Bearer <token> + admin role
- Response 200: full transaction list with dispute and document details

#### PUT /api/admin/transactions/:id/resolve
- Headers: Authorization: Bearer <token> + admin role
- Body:
```json
{
  "status": "completed",
  "notes": "Transacción resuelta manualmente"
}
```

#### GET /api/admin/disputes
- Headers: Authorization: Bearer <token> + admin role
- Response 200: dispute list for admin review

#### PUT /api/admin/disputes/:id/resolve
- Headers: Authorization: Bearer <token> + admin role
- Body:
```json
{
  "status": "resolved",
  "adminNotes": "Se resolvió a favor del comprador"
}
```

### 4.11 Currency

#### GET /api/currency/rate
- No authentication required
- Response 200:
```json
{
  "success": true,
  "rate": 0.000001,
  "updatedAt": "2026-06-27T00:00:00.000Z"
}
```

#### GET /api/currency/rate/update
- Headers: Authorization: Bearer <token> + admin role
- Response 200: updates the exchange rate from the external source and persists it in the database

---

## 5. Production security and hardening recommendations

### 5.1 Required environment variables

- DATABASE_CONNECTION_STRING
- BACKEND_URL
- FRONTEND_URL
- BETTER_AUTH_SECRET or JWT_SECRET
- REFRESH_SECRET
- CHAT_ENCRYPTION_KEY
- STORAGE_PROVIDER
- STORAGE_CONNECTION_STRING
- CORS_ALLOWED_ORIGINS
- TRUSTED_ORIGINS

### 5.2 Operational recommendations
- Use HTTPS in production.
- Keep PostgreSQL backups automated.
- Configure PostgreSQL SSL with DATABASE_SSL_MODE and DATABASE_SSL_CA when applicable.
- Restrict CORS to explicit origins.
- Use external storage (Azure Blob, S3, or similar) instead of local storage in production.
- Enable monitoring with Sentry and centralized logs.
- Review rate limits and role controls before opening the backend publicly.

### 5.3 Deployment checklist
- [ ] Run Prisma migrations.
- [ ] Generate Prisma client.
- [ ] Configure production environment variables.
- [ ] Validate file storage and public URLs.
- [ ] Test login, registration, product creation, and transactions end-to-end.
- [ ] Verify push notifications and web sockets.
- [ ] Confirm sensitive fields (addresses, messages) are encrypted.

---

## 6. Key components summary

- Authentication: Better Auth + phone OTP
- Database: PostgreSQL with Prisma
- File uploads: Multer + configurable storage
- Business logic: products, transactions, seller applications, notifications, disputes
- Real-time: Socket.io for chat and transaction updates

This document covers the architecture, data model, and primary backend endpoints. For a complete production implementation, it is recommended to complement it with:
- module-level business flow documentation,
- sequence diagrams (checkout, seller approval, dispute),
- DevOps deployment guide,
- Postman collection or OpenAPI specification.
