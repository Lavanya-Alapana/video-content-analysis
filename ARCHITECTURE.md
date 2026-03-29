# 🏗️ Enterprise Architecture Documentation

## Overview

Professional full-stack video content moderation platform with clean architecture, separation of concerns, and industry best practices.

---

## 🎯 Backend Architecture

### Layered Architecture Pattern

```
┌─────────────────────────────────────┐
│         Routes Layer                │  ← API Endpoints
├─────────────────────────────────────┤
│       Controllers Layer             │  ← Request/Response Handling
├─────────────────────────────────────┤
│        Services Layer               │  ← Business Logic
├─────────────────────────────────────┤
│      Repositories Layer             │  ← Data Access
├─────────────────────────────────────┤
│         Models Layer                │  ← Database Schemas
└─────────────────────────────────────┘
```

### Directory Structure

```
backend/src/
├── config/                    # Configuration & Setup
│   ├── database.js           # MongoDB connection
│   ├── env.js                # Environment validation
│   ├── redis.js              # Redis configuration
│   └── socket.js             # Socket.io initialization
│
├── constants/                 # Centralized Constants
│   └── index.js              # All app constants
│
├── controllers/               # HTTP Request Handlers
│   ├── AuthController.js     # Auth endpoints logic
│   └── VideoController.js    # Video endpoints logic
│
├── middleware/                # Express Middleware
│   ├── auth.js               # JWT authentication
│   ├── upload.js             # Multer file upload
│   └── errorMiddleware.js    # Error handling
│
├── models/                    # Mongoose Schemas
│   ├── User.js               # User model
│   └── Video.js              # Video model
│
├── repositories/              # Data Access Layer
│   ├── UserRepository.js     # User CRUD operations
│   └── VideoRepository.js    # Video CRUD operations
│
├── routes/                    # API Route Definitions
│   ├── auth.js               # /api/auth routes
│   └── video.js              # /api/videos routes
│
├── services/                  # Business Logic
│   ├── AuthService.js        # Auth operations
│   ├── VideoService.js       # Video queue management
│   ├── ProcessingService.js  # Video processing pipeline
│   ├── frameExtractor.js     # FFmpeg frame extraction
│   └── geminiAnalyzer.js     # AI content analysis
│
├── utils/                     # Helper Functions
│   ├── logger.js             # Structured logging
│   ├── errorHandler.js       # Error utilities
│   └── fileHelper.js         # File operations
│
├── validators/                # Input Validation
│   ├── authValidator.js      # Auth request validation
│   └── videoValidator.js     # Video request validation
│
├── server.js                  # Application entry point
└── worker.js                  # Background job processor
```

### Key Design Patterns

1. **Repository Pattern**: Abstracts data access
2. **Service Layer**: Encapsulates business logic
3. **Dependency Injection**: Singleton services
4. **Error Handling**: Centralized middleware
5. **Constants**: No magic strings/numbers

---

## 🎨 Frontend Architecture

### Feature-Based Structure

```
frontend/src/
├── components/                # Reusable Components
│   └── common/
│       ├── Button.jsx        # Styled button component
│       ├── Button.css
│       └── PrivateRoute.jsx  # Auth route guard
│
├── features/                  # Feature Modules
│   ├── auth/
│   │   ├── Login.jsx         # Login page
│   │   └── Login.css
│   └── dashboard/
│       ├── Dashboard.jsx     # Main dashboard
│       ├── Dashboard.css
│       ├── VideoList.jsx     # Video grid
│       ├── VideoList.css
│       ├── VideoUpload.jsx   # Upload component
│       ├── VideoUpload.css
│       ├── VideoPlayer.jsx   # Video modal player
│       └── VideoPlayer.css
│
├── hooks/                     # Custom React Hooks
│   └── useSocket.js          # Socket.io integration
│
├── services/                  # API Layer
│   ├── api.js                # Axios instance + interceptors
│   ├── authService.js        # Auth API calls
│   └── videoService.js       # Video API calls
│
├── store/                     # Redux Toolkit
│   ├── index.js              # Store configuration
│   └── slices/
│       ├── authSlice.js      # Auth state + thunks
│       └── videoSlice.js     # Video state + thunks
│
├── styles/                    # Global Styles
│   └── theme.css             # CSS variables (B&W theme)
│
├── utils/                     # Utilities
│   └── formatters.js         # Date, size, percentage formatters
│
├── constants/                 # Frontend Constants
│   └── index.js              # API URLs, roles, status
│
├── App.jsx                    # Root component
├── main.jsx                   # Entry point
└── index.css                  # Global reset styles
```

### State Management (Redux Toolkit)

```
Store
├── auth slice
│   ├── State: user, token, loading, error
│   └── Actions: login, register, logout, loadUser
│
└── videos slice
    ├── State: items, selectedVideo, filter, loading, uploading
    └── Actions: fetchVideos, uploadVideo, deleteVideo, updateProgress
```

### Design System (Black & White Theme)

**Colors:**

- Primary: #000000 (Black)
- Secondary: #FFFFFF (White)
- Backgrounds: #FFFFFF, #F5F5F5, #E8E8E8
- Text: #000000, #666666, #999999
- Borders: #E0E0E0, #CCCCCC

**Typography:**

- Font: System fonts (-apple-system, Segoe UI, Roboto)
- Sizes: 12px, 14px, 16px, 18px, 24px, 32px
- Weights: 400, 500, 600, 700

**Spacing Scale:**

- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px, 2XL: 48px

---

## 🔄 Data Flow

### Video Upload Flow

```
User → VideoUpload Component
     → Redux uploadVideo thunk
     → videoService.uploadVideo()
     → API POST /api/videos/upload
     → VideoController.upload()
     → VideoRepository.create()
     → VideoService.queueVideoProcessing()
     → BullMQ Queue
     → Worker picks job
     → ProcessingService.processVideo()
     → Extract frames → Analyze with Gemini → Update DB
     → Socket.io emits progress
     → Redux updateVideoProgress
     → UI updates in real-time
```

### Authentication Flow

```
User → Login Component
     → Redux login thunk
     → authService.login()
     → API POST /api/auth/login
     → AuthController.login()
     → UserRepository.findByEmail()
     → Validate password
     → Generate JWT
     → Store token + user in Redux
     → Navigate to dashboard
```

---

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Role-Based Access Control**: Viewer, Editor, Admin
3. **Multi-Tenant Isolation**: Organization-based data segregation
4. **Input Validation**: express-validator on all endpoints
5. **Error Handling**: No sensitive data leakage
6. **CORS**: Configured for security

---

## 📊 Technology Stack

### Backend

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Queue**: BullMQ + Redis
- **Real-time**: Socket.io
- **AI**: Google Gemini 2.5 Flash
- **Video**: FFmpeg

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **State**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP**: Axios
- **Real-time**: Socket.io Client
- **Styling**: CSS Modules + CSS Variables

---

## 🚀 Getting Started

### Prerequisites

- Docker Desktop
- Node.js 20+

### Installation

1. **Start Docker services:**

```bash
docker-compose up -d
```

2. **Seed demo users:**

```bash
cd backend
npm run seed
```

3. **Start frontend:**

```bash
cd frontend
npm run dev
```

### Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

### Demo Accounts

- Admin: admin@test.com / admin123
- Editor: editor@test.com / editor123
- Viewer: viewer@test.com / viewer123

---

## 📝 Code Quality Standards

### Backend

✅ Layered architecture
✅ Repository pattern
✅ Service layer abstraction
✅ Centralized error handling
✅ Input validation
✅ Structured logging
✅ Constants management
✅ Async/await error handling

### Frontend

✅ Feature-based structure
✅ Redux Toolkit for state
✅ Custom hooks
✅ Service layer for API
✅ Component composition
✅ CSS variables for theming
✅ Responsive design
✅ Real-time updates

---

## 🎯 Best Practices Implemented

1. **Separation of Concerns**: Each layer has single responsibility
2. **DRY Principle**: No code duplication
3. **SOLID Principles**: Clean, maintainable code
4. **Error Handling**: Graceful error recovery
5. **Logging**: Comprehensive logging for debugging
6. **Type Safety**: Consistent data structures
7. **Security**: Authentication, authorization, validation
8. **Performance**: Efficient queries, caching, streaming
9. **Scalability**: Queue-based processing, modular design
10. **Maintainability**: Clear structure, documentation

---

## 📦 Deployment Ready

- Environment-based configuration
- Docker containerization
- Production error handling
- Logging infrastructure
- Health check endpoints
- Graceful shutdown handling
