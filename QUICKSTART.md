# 🚀 Quick Start Guide

## One-Command Setup

### Windows

```powershell
.\setup.ps1
```

### Linux/Mac

```bash
chmod +x setup.sh
./setup.sh
```

That's it! The script handles everything automatically.

---

## What the Setup Script Does

1. ✅ Checks Docker & Node.js installation
2. ✅ Creates .env file with defaults
3. ✅ Installs backend dependencies
4. ✅ Installs frontend dependencies
5. ✅ Builds and starts Docker services
6. ✅ Seeds database with demo users
7. ✅ Starts frontend dev server

---

## Access

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## Demo Users

| Role   | Email           | Password  | Permissions   |
| ------ | --------------- | --------- | ------------- |
| Admin  | admin@test.com  | admin123  | Full access   |
| Editor | editor@test.com | editor123 | Upload & View |
| Viewer | viewer@test.com | viewer123 | View only     |

---

## How to Use

1. **Login** with any demo account
2. **Upload** a video (drag & drop or click)
3. **Watch** real-time processing progress
4. **Click** any video card to play/download
5. **Filter** by status (All, Safe, Flagged, Processing)

---

## Useful Commands

```bash
# View backend logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up -d --build backend
```

---

## Troubleshooting

**Services won't start?**

- Ensure Docker Desktop is running
- Check ports 5000, 27017, 6379 are available

**Video won't play?**

- Check browser console for errors
- Verify you're logged in

**Gemini API errors?**

- Free tier limits: 5 req/min, 20 req/day
- Some content blocked by safety filters

---

## Tech Stack

**Backend**: Express, MongoDB, Redis, BullMQ, Socket.io, Gemini AI, FFmpeg  
**Frontend**: React 18, Redux Toolkit, Vite

---

For detailed architecture, see `ARCHITECTURE.md`
