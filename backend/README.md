# Backend Architecture

## 📁 Folder Structure

```
backend/src/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   ├── env.js        # Environment variables
│   ├── redis.js      # Redis configuration
│   └── socket.js     # Socket.io setup
├── constants/        # Application constants
│   └── index.js      # All constants centralized
├── controllers/      # Request handlers
│   ├── AuthController.js
│   └── VideoController.js
├── middleware/       # Express middleware
│   ├── auth.js       # Authentication & authorization
│   ├── upload.js     # File upload handling
│   └── errorMiddleware.js
├── models/           # Mongoose schemas
│   ├── User.js
│   └── Video.js
├── repositories/     # Data access layer
│   ├── UserRepository.js
│   └── VideoRepository.js
├── routes/           # API routes
│   ├── auth.js
│   └── video.js
├── services/         # Business logic
│   ├── AuthService.js
│   ├── VideoService.js
│   ├── ProcessingService.js
│   ├── frameExtractor.js
│   └── geminiAnalyzer.js
├── utils/            # Helper functions
│   ├── logger.js
│   ├── errorHandler.js
│   └── fileHelper.js
├── validators/       # Input validation
│   ├── authValidator.js
│   └── videoValidator.js
├── server.js         # Application entry point
└── worker.js         # Background job processor
```

## 🏗️ Architecture Layers

### 1. Routes Layer

- Define API endpoints
- Apply middleware
- Delegate to controllers

### 2. Controllers Layer

- Handle HTTP requests/responses
- Input validation
- Call services

### 3. Services Layer

- Business logic
- Orchestrate operations
- Call repositories

### 4. Repositories Layer

- Database operations
- Data access abstraction
- Query building

### 5. Models Layer

- Mongoose schemas
- Data validation
- Instance methods

## 🔑 Key Patterns

- **Dependency Injection**: Services and repositories as singletons
- **Separation of Concerns**: Each layer has single responsibility
- **Error Handling**: Centralized error middleware
- **Constants**: All magic strings/numbers in constants file
- **Logging**: Structured logging with logger utility
