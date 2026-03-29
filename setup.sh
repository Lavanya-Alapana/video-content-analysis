#!/bin/bash

# Video Analysis Platform - Unix/Linux/Mac Setup Script
# This script sets up and runs the entire application

echo "========================================"
echo "  Video Analysis Platform Setup"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo -e "${YELLOW}[1/6] Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo -e "${RED}Please install Docker from: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is installed${NC}"

# Check if Docker is running
echo -e "${YELLOW}[2/6] Checking Docker status...${NC}"
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo -e "${RED}Please start Docker and try again${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"

# Check if Node.js is installed
echo -e "${YELLOW}[3/6] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo -e "${RED}Please install Node.js from: https://nodejs.org/${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js $NODE_VERSION is installed${NC}"

# Create .env file if it doesn't exist
echo -e "${YELLOW}[4/6] Setting up environment...${NC}"
if [ ! -f .env ]; then
    echo -e "${CYAN}Creating .env file...${NC}"
    cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/video-analysis
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
GEMINI_API_KEY= 
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Install backend dependencies
echo -e "${YELLOW}[5/6] Installing dependencies...${NC}"
echo -e "${CYAN}Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Backend dependency installation failed!${NC}"
        cd ..
        exit 1
    fi
fi
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Install frontend dependencies
echo -e "${CYAN}Installing frontend dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend dependency installation failed!${NC}"
        cd ..
        exit 1
    fi
fi
cd ..
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Start Docker services
echo -e "${YELLOW}[6/6] Starting services...${NC}"
echo -e "${CYAN}Starting Docker containers (MongoDB, Redis, Backend)...${NC}"
docker-compose up -d --build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start Docker services!${NC}"
    exit 1
fi

# Wait for services to be ready
echo -e "${CYAN}Waiting for services to start...${NC}"
sleep 5

# Check if services are running
BACKEND_RUNNING=$(docker ps --filter "name=video-backend" --filter "status=running" -q)
MONGO_RUNNING=$(docker ps --filter "name=video-mongodb" --filter "status=running" -q)
REDIS_RUNNING=$(docker ps --filter "name=video-redis" --filter "status=running" -q)

if [ -z "$BACKEND_RUNNING" ] || [ -z "$MONGO_RUNNING" ] || [ -z "$REDIS_RUNNING" ]; then
    echo -e "${RED}❌ Some services failed to start!${NC}"
    echo -e "${YELLOW}Check logs with: docker-compose logs${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker services started${NC}"

# Seed database with demo users
echo -e "${CYAN}Seeding database with demo users...${NC}"
docker-compose exec -T backend node src/scripts/seedUsers.js > /dev/null 2>&1
echo -e "${GREEN}✅ Database seeded${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  🎉 Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}Services running:${NC}"
echo -e "  • Backend API: http://localhost:5000"
echo -e "  • MongoDB: mongodb://localhost:27017"
echo -e "  • Redis: redis://localhost:6379"
echo ""
echo -e "${YELLOW}Starting frontend development server...${NC}"
echo ""
echo -e "${CYAN}Demo Users:${NC}"
echo -e "  • Admin:  admin@test.com / admin123"
echo -e "  • Editor: editor@test.com / editor123"
echo -e "  • Viewer: viewer@test.com / viewer123"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the frontend server${NC}"
echo -e "${YELLOW}To stop all services, run: docker-compose down${NC}"
echo ""

# Start frontend dev server
cd frontend
npm run dev
