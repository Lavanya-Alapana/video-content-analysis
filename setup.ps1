# Video Analysis Platform - Windows Setup Script
# This script sets up and runs the entire application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Video Analysis Platform Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "[1/6] Checking Docker..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is installed" -ForegroundColor Green

# Check if Docker is running
Write-Host "[2/6] Checking Docker status..." -ForegroundColor Yellow
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "[3/6] Checking Node.js..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}
$nodeVersion = node --version
Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green

# Create .env file if it doesn't exist
Write-Host "[4/6] Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    @"
MONGO_URI=mongodb://localhost:27017/video-analysis
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
GEMINI_API_KEY= 
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "[5/6] Installing dependencies..." -ForegroundColor Yellow
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
if (!(Test-Path node_modules)) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend dependency installation failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}
Set-Location ..
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
if (!(Test-Path node_modules)) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend dependency installation failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}
Set-Location ..
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Start Docker services
Write-Host "[6/6] Starting services..." -ForegroundColor Yellow
Write-Host "Starting Docker containers (MongoDB, Redis, Backend)..." -ForegroundColor Cyan
docker-compose up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Docker services!" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "Waiting for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check if services are running
$backendRunning = docker ps --filter "name=video-backend" --filter "status=running" -q
$mongoRunning = docker ps --filter "name=video-mongodb" --filter "status=running" -q
$redisRunning = docker ps --filter "name=video-redis" --filter "status=running" -q

if (!$backendRunning -or !$mongoRunning -or !$redisRunning) {
    Write-Host "❌ Some services failed to start!" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker services started" -ForegroundColor Green

# Seed database with demo users
Write-Host "Seeding database with demo users..." -ForegroundColor Cyan
docker-compose exec -T backend node src/scripts/seedUsers.js 2>&1 | Out-Null
Write-Host "✅ Database seeded" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  🎉 Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services running:" -ForegroundColor Cyan
Write-Host "  • Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  • MongoDB: mongodb://localhost:27017" -ForegroundColor White
Write-Host "  • Redis: redis://localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "Starting frontend development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Demo Users:" -ForegroundColor Cyan
Write-Host "  • Admin:  admin@test.com / admin123" -ForegroundColor White
Write-Host "  • Editor: editor@test.com / editor123" -ForegroundColor White
Write-Host "  • Viewer: viewer@test.com / viewer123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the frontend server" -ForegroundColor Yellow
Write-Host "To stop all services, run: docker-compose down" -ForegroundColor Yellow
Write-Host ""

# Start frontend dev server
Set-Location frontend
npm run dev
