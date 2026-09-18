#!/bin/bash

# PPID Kabsor - Development Server Starter
# Menjalankan backend FastAPI di port 8891 dan frontend Vite

echo "🚀 Starting PPID Kabsor Development Servers..."
echo "================================================="

# Load environment configuration
if [ -f "dev_env.sh" ]; then
    source dev_env.sh
else
    # Fallback environment variables
    export DATABASE_URL="postgresql://akazaya@localhost:5432/ppid_kabsor_db"
    export BACKEND_PORT=8891
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
fi

# Kill existing processes jika ada
echo -e "${YELLOW}🔄 Stopping existing servers...${NC}"
pkill -f "uvicorn.*app.main:app" 2>/dev/null || true
pkill -f "vite.*dev" 2>/dev/null || true
sleep 2

# Function to start backend
start_backend() {
    echo -e "${BLUE}🐍 Starting FastAPI Backend on port 8891...${NC}"
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${RED}❌ Virtual environment not found! Run setup first.${NC}"
        exit 1
    fi
    
    # Activate virtual environment and run
    source venv/bin/activate
    python run.py &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${GREEN}⚡ Starting Vite Frontend...${NC}"
    # Run Vite directly from root since vite.config.ts is configured for this
    npx vite --port 5173 &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
}

# Check if Python dependencies are installed
if [ ! -f "backend/app/__init__.py" ]; then
    echo -e "${RED}❌ Backend directory not found!${NC}"
    exit 1
fi

# Check if Node dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
    npm install
fi

# Start servers
start_backend
sleep 3
start_frontend

# Wait a bit and show status
sleep 5
echo ""
echo -e "${GREEN}✅ Development servers started!${NC}"
echo "================================================="
echo -e "${BLUE}🔗 Backend API: http://localhost:8891${NC}"
echo -e "${BLUE}🔗 FastAPI Docs: http://localhost:8891/docs${NC}"
echo -e "${GREEN}🔗 Frontend: http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}📝 To stop servers, run: ./stop_dev.sh${NC}"
echo -e "${YELLOW}📝 To restart servers, run: ./restart_dev.sh${NC}"
echo ""

# Keep script running
echo "Press Ctrl+C to stop all servers..."
wait