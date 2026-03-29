# 📹 Video Content Moderation Platform

Enterprise-grade full-stack application for video upload, AI-powered content analysis, and real-time streaming.

## 🏗️ Architecture

**Backend**: Layered architecture with 7 layers (Config, Controllers, Services, Repositories, Models, Middleware, Utils)  
**Frontend**: Feature-based structure with Redux Toolkit state management  
**Theme**: Professional black & white minimal UI

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (running)
- Node.js 18+
- npm or yarn

### One-Command Setup

**Windows (PowerShell):**

```powershell
.\setup.ps1
```

**Linux/Mac (Bash):**

```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:

1. Check Docker and Node.js installation
2. Create .env file with default configuration
3. Install all dependencies (backend + frontend)
4. Build and start Docker services (MongoDB, Redis, Backend)
5. Seed database with demo users
6. Start frontend development server

### Manual Setup

If you prefer manual setup:

#### 1. Start Docker Desktop (Important!)

#### 2. Create .env file

```bash
cp .env.example .env
# Or create manually with required variables
```

#### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
cd ..
```

#### 4. Start Services

```bash
docker-compose up -d --build
```

#### 5. Seed Demo Users

```bash
docker-compose exec backend node src/scripts/seedUsers.js
```

#### 6. Start Frontend

```bash
cd frontend
npm run dev
```

### Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👥 Demo Accounts

- **Admin**: admin@test.com / admin123 (Upload, Edit, Delete, View)
- **Editor**: editor@test.com / editor123 (Upload, Edit, View)
- **Viewer**: viewer@test.com / viewer123 (View Only)

## ✨ Features

✅ Video upload with drag & drop  
✅ AI content detection (Nudity & Violence) using Gemini AI  
✅ Real-time processing updates via WebSocket  
✅ Video streaming with authentication  
✅ Video download functionality  
✅ Multi-tenant organization support  
✅ Role-based access control (RBAC)  
✅ Professional black & white UI theme  
✅ Fully responsive design (mobile, tablet, desktop)

## 🎯 How to Use

1. Login with any demo account
2. Upload a video (Editor/Admin only)
3. Watch real-time processing progress
4. View sensitivity scores (Nudity, Violence, AI Confidence)
5. Click any video card to play/download
6. Filter videos by status (All, Safe, Flagged, Processing)

## 🛠️ Tech Stack

**Backend**: Node.js, Express, MongoDB, Redis, BullMQ, Socket.io, Gemini AI, FFmpeg  
**Frontend**: React 18, Redux Toolkit, Vite, Axios, Socket.io Client

## 📖 Documentation

- `ARCHITECTURE.md` - Complete architecture guide
- `backend/README.md` - Backend layer details
- `frontend/README.md` - Frontend structure guide
- `QUICKSTART.md` - Quick reference guide

## 🐳 Docker Services

- **video-backend**: Express API + BullMQ Worker
- **video-mongodb**: MongoDB 7
- **video-redis**: Redis 7 Alpine

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up -d --build backend

# Access backend shell
docker-compose exec backend sh

# View all containers
docker-compose ps
```

## 🔑 Environment Variables

Required in `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/video-analysis
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your-gemini-api-key
```

## 🚨 Troubleshooting

**Docker services won't start:**

- Ensure Docker Desktop is running
- Check ports 5000, 27017, 6379 are not in use
- Run `docker-compose down` and try again

**Frontend can't connect to backend:**

- Verify backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

**Video won't play:**

- Check browser console for errors
- Verify you're logged in (token exists)
- Check backend logs for stream requests

**Gemini API errors:**

- Verify API key in .env
- Check rate limits (5 req/min, 20 req/day for free tier)
- Some content may be blocked by safety filters

## 📝 License

MIT

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

For video streaming, token can also be passed as query parameter:

```
?token=<token>
```

---

### Auth Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "viewer",
  "orgId": "org1"
}
```

**Response:**

```json
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "role": "viewer",
    "orgId": "org1"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Roles:** `viewer`, `editor`, `admin`

---

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "user": {
    "_id": "...",
    "email": "admin@test.com",
    "role": "admin",
    "orgId": "org1"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "user": {
    "_id": "...",
    "email": "admin@test.com",
    "role": "admin",
    "orgId": "org1"
  }
}
```

---

### Video Endpoints

#### Upload Video

```http
POST /api/videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
```

**Permissions:** Editor, Admin only

**Response:**

```json
{
  "video": {
    "_id": "...",
    "userId": "...",
    "orgId": "org1",
    "filename": "1774803579414-721118014.mp4",
    "originalName": "my-video.mp4",
    "path": "uploads/1774803579414-721118014.mp4",
    "size": 33165327,
    "mimetype": "video/mp4",
    "status": "uploaded",
    "processingProgress": 0,
    "createdAt": "2026-03-29T16:59:39.831Z",
    "updatedAt": "2026-03-29T16:59:39.831Z"
  }
}
```

**Notes:**

- Max file size: 100MB
- Accepted formats: MP4, WebM, OGG
- Processing starts automatically
- Real-time updates via WebSocket

---

#### List Videos

```http
GET /api/videos
Authorization: Bearer <token>

# Optional: Filter by status
GET /api/videos?status=flagged
```

**Query Parameters:**

- `status` (optional): `uploaded`, `processing`, `safe`, `flagged`, `failed`

**Response:**

```json
{
  "videos": [
    {
      "_id": "...",
      "userId": "...",
      "orgId": "org1",
      "filename": "1774803579414-721118014.mp4",
      "originalName": "my-video.mp4",
      "path": "uploads/1774803579414-721118014.mp4",
      "size": 33165327,
      "mimetype": "video/mp4",
      "status": "flagged",
      "processingProgress": 100,
      "sensitivity": {
        "nudityScore": 0.9,
        "violenceScore": 0,
        "aiConfidence": 0.85,
        "flaggedFrames": ["frame_0302.jpg"],
        "details": "Analyzed 1 frame(s), 1 flagged"
      },
      "createdAt": "2026-03-29T16:59:39.831Z",
      "updatedAt": "2026-03-29T16:59:50.549Z"
    }
  ]
}
```

**Notes:**

- Returns only videos from user's organization
- Sorted by creation date (newest first)

---

#### Get Video by ID

```http
GET /api/videos/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "video": {
    "_id": "69c95a7b0cd94fe9a719b2e6",
    "userId": "...",
    "orgId": "org1",
    "filename": "1774803579414-721118014.mp4",
    "originalName": "my-video.mp4",
    "path": "uploads/1774803579414-721118014.mp4",
    "size": 33165327,
    "mimetype": "video/mp4",
    "status": "flagged",
    "processingProgress": 100,
    "sensitivity": {
      "nudityScore": 0.9,
      "violenceScore": 0,
      "aiConfidence": 0.85,
      "flaggedFrames": ["frame_0302.jpg"],
      "details": "Analyzed 1 frame(s), 1 flagged"
    },
    "createdAt": "2026-03-29T16:59:39.831Z",
    "updatedAt": "2026-03-29T16:59:50.549Z"
  }
}
```

---

#### Stream Video

```http
GET /api/videos/:id/stream
Authorization: Bearer <token>

# Or with query parameter
GET /api/videos/:id/stream?token=<token>
```

**Response:**

- Video stream with range request support
- Content-Type: video/mp4 (or video mimetype)
- Supports partial content (206) for seeking

**Notes:**

- Used by HTML5 video player
- Supports range requests for seeking
- Token can be in header or query parameter

---

#### Delete Video

```http
DELETE /api/videos/:id
Authorization: Bearer <token>
```

**Permissions:** Editor, Admin only

**Response:**

```json
{
  "message": "Video deleted successfully"
}
```

**Notes:**

- Deletes video file from disk
- Removes database record
- Only accessible by video owner's organization

---

### WebSocket Events

#### Connection

```javascript
const socket = io("http://localhost:5000");
```

#### Video Progress Updates

```javascript
socket.on("video-progress", (data) => {
  console.log(data);
  // {
  //   videoId: "69c95a7b0cd94fe9a719b2e6",
  //   progress: 100,
  //   status: "flagged",
  //   sensitivity: {
  //     nudityScore: 0.9,
  //     violenceScore: 0,
  //     aiConfidence: 0.85,
  //     flaggedFrames: ["frame_0302.jpg"],
  //     details: "Analyzed 1 frame(s), 1 flagged"
  //   }
  // }
});
```

**Event Data:**

- `videoId`: Video ID being processed
- `progress`: Processing progress (0-100)
- `status`: Current status (`processing`, `safe`, `flagged`, `failed`)
- `sensitivity`: Analysis results (only when complete)

---

### Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

### Rate Limits

**Gemini AI (Free Tier):**

- 5 requests per minute
- 20 requests per day

**Processing:**

- 1 frame analyzed per video (middle frame)
- Automatic retry on rate limit errors

---

### Video Processing Flow

1. **Upload** → Status: `uploaded`
2. **Queue Job** → BullMQ adds to processing queue
3. **Extract Frames** → FFmpeg extracts 10 frames
4. **Analyze** → Gemini AI analyzes middle frame
5. **Update Status** → `safe` or `flagged` based on scores
6. **WebSocket Notify** → Real-time update to frontend

**Flagging Criteria:**

- Nudity score > 0.6 → Flagged
- Violence score > 0.6 → Flagged
- Safety filter blocked → Flagged as nudity

---

### Example: Complete Upload Flow

```javascript
// 1. Login
const loginRes = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "editor@test.com",
    password: "editor123",
  }),
});
const { token } = await loginRes.json();

// 2. Upload video
const formData = new FormData();
formData.append("video", videoFile);

const uploadRes = await fetch("http://localhost:5000/api/videos/upload", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
const { video } = await uploadRes.json();

// 3. Listen for progress
socket.on("video-progress", (data) => {
  if (data.videoId === video._id) {
    console.log(`Progress: ${data.progress}%`);
    if (data.status === "safe" || data.status === "flagged") {
      console.log("Analysis complete:", data.sensitivity);
    }
  }
});

// 4. Stream video
const streamUrl = `http://localhost:5000/api/videos/${video._id}/stream?token=${token}`;
// Use in <video> element
```

---

### Security Notes

- JWT tokens expire after 7 days
- Passwords hashed with bcrypt (10 rounds)
- Multi-tenant isolation by orgId
- Role-based access control (RBAC)
- File uploads validated (type, size)
- Video streaming requires authentication
- CORS enabled for localhost:5173

---

### Database Schema

**User Model:**

```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String (viewer|editor|admin),
  orgId: String,
  createdAt: Date
}
```

**Video Model:**

```javascript
{
  userId: ObjectId,
  orgId: String,
  filename: String,
  originalName: String,
  path: String,
  size: Number,
  mimetype: String,
  status: String (uploaded|processing|safe|flagged|failed),
  processingProgress: Number (0-100),
  sensitivity: {
    nudityScore: Number (0-1),
    violenceScore: Number (0-1),
    aiConfidence: Number (0-1),
    flaggedFrames: [String],
    details: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

**Built with enterprise patterns for production-ready deployment.**
