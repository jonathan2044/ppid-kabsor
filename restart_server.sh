#!/bin/bash

# PPID Kabsor - Complete Server Restart Script
# Script untuk restart semua service aplikasi dengan aman

echo "🔄 PPID Kabsor - Complete Server Restart"
echo "========================================"

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

echo -e "${YELLOW}🛑 Step 1: Stopping all PPID Kabsor services...${NC}"

# Stop specific processes for this application only
echo -e "   ${BLUE}• Stopping FastAPI backend (port 8891)...${NC}"
# Kill process specifically running on port 8891
lsof -ti :8891 | xargs kill -9 2>/dev/null || echo "     No process on port 8891"

# Kill FastAPI processes for this specific app
pkill -f "python.*run.py" 2>/dev/null || echo "     No FastAPI process found"
pkill -f "uvicorn.*app.main:app" 2>/dev/null || echo "     No uvicorn process found"

echo -e "   ${BLUE}• Stopping Vite frontend (port 5173)...${NC}"
# Kill process specifically running on port 5173
lsof -ti :5173 | xargs kill -9 2>/dev/null || echo "     No process on port 5173"

# Kill Vite processes specifically for this project
pkill -f "vite.*ppid-kabsor" 2>/dev/null || echo "     No Vite process found"
pkill -f "tsx.*server.*ppid-kabsor" 2>/dev/null || echo "     No tsx server process found"

# Wait for processes to fully terminate
echo -e "   ${YELLOW}• Waiting for processes to terminate...${NC}"
sleep 3

# Double check and force kill if needed
if lsof -ti :8891 >/dev/null 2>&1; then
    echo -e "   ${RED}• Force killing remaining processes on port 8891...${NC}"
    lsof -ti :8891 | xargs kill -9 2>/dev/null
fi

if lsof -ti :5173 >/dev/null 2>&1; then
    echo -e "   ${RED}• Force killing remaining processes on port 5173...${NC}"
    lsof -ti :5173 | xargs kill -9 2>/dev/null
fi

# Final wait
sleep 2

echo -e "${GREEN}✅ All PPID Kabsor services stopped successfully!${NC}"
echo ""

echo -e "${YELLOW}🔍 Step 2: Verifying prerequisites...${NC}"

# Check Python virtual environment
if [ ! -d "backend/venv" ]; then
    echo -e "${RED}❌ Python virtual environment not found!${NC}"
    echo -e "${YELLOW}   Run: ./setup_backend.sh first${NC}"
    exit 1
fi

# Check Node modules
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
    npm install
fi

# Test database connection
echo -e "${YELLOW}🔍 Testing database connection...${NC}"
cd backend
source venv/bin/activate
python -c "
import sys
sys.path.append('.')
from app.database import test_db_connection
if test_db_connection():
    print('✅ Database connection OK')
else:
    print('❌ Database connection failed')
    sys.exit(1)
" || {
    echo -e "${RED}❌ Database connection failed!${NC}"
    echo -e "${YELLOW}   Make sure PostgreSQL is running and database exists${NC}"
    exit 1
}
cd ..

echo -e "${GREEN}✅ All prerequisites verified!${NC}"
echo ""

echo -e "${YELLOW}🚀 Step 3: Starting PPID Kabsor services...${NC}"

# Function to start backend
start_backend() {
    echo -e "${BLUE}🐍 Starting FastAPI Backend on port 8891...${NC}"
    cd backend
    source venv/bin/activate
    python run.py &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"
    cd ..
    
    # Wait for backend to start
    echo -e "   ${YELLOW}Waiting for backend to start...${NC}"
    sleep 5
    
    # Test backend
    if curl -s "http://localhost:8891/docs" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Backend started successfully!${NC}"
    else
        echo -e "   ${RED}❌ Backend failed to start!${NC}"
        exit 1
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "${GREEN}⚡ Starting Vite Frontend on port 5173...${NC}"
    npx vite --port 5173 &
    FRONTEND_PID=$!
    echo "   Frontend PID: $FRONTEND_PID"
    
    # Wait for frontend to start
    echo -e "   ${YELLOW}Waiting for frontend to start...${NC}"
    sleep 5
    
    # Test frontend
    if curl -s "http://localhost:5173" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Frontend started successfully!${NC}"
    else
        echo -e "   ${YELLOW}⚠️ Frontend may still be starting...${NC}"
    fi
}

# Start services
start_backend
start_frontend

echo ""
echo -e "${GREEN}🎉 PPID Kabsor Server Restart Complete!${NC}"
echo "========================================"
echo -e "${BLUE}🔗 Backend API: http://localhost:8891${NC}"
echo -e "${BLUE}🔗 FastAPI Docs: http://localhost:8891/docs${NC}"
echo -e "${GREEN}🔗 Frontend: http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo -e "   Stop servers:    ${BLUE}./stop_dev.sh${NC}"
echo -e "   Check status:    ${BLUE}./status.sh${NC}"
echo -e "   Restart again:   ${BLUE}./restart_server.sh${NC}"
echo ""
echo -e "${GREEN}✅ Ready for development!${NC}"

# Keep script running and show logs
echo ""
echo -e "${YELLOW}📋 Live server logs (Press Ctrl+C to stop monitoring):${NC}"
echo "================================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}👋 Server restart script finished.${NC}"
    echo -e "${BLUE}Servers are still running in background.${NC}"
    echo -e "${YELLOW}Use ./stop_dev.sh to stop them when needed.${NC}"
    exit 0
}

# Set trap for Ctrl+C
trap cleanup INT

# Monitor logs for a while
timeout 10 tail -f /dev/null 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Server restart completed successfully!${NC}"
echo -e "${BLUE}Servers are running in background.${NC}"