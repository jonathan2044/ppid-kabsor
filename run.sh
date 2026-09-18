#!/bin/bash

# PPID Kabsor - Quick Run Script  
# Script ini untuk run aplikasi dengan sekali klik tanpa manual setup

echo "🚀 PPID Kabsor - Quick Start"
echo "================================"

# Load environment
source dev_env.sh

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

# Check Python environment
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

# Check database connection
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
    echo -e "${YELLOW}   Run: ./setup_postgresql.sh if needed${NC}"
    exit 1
}
cd ..

echo -e "${GREEN}✅ All prerequisites checked${NC}"
echo ""

# Start the application
./start_dev.sh