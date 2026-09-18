#!/bin/bash

# PPID Kabsor - Status Checker

echo "📊 PPID Kabupaten Sorong - System Status"
echo "========================================"

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check ports
echo -e "${BLUE}🔍 Port Status:${NC}"

# Backend port (8891)
if lsof -i :8891 > /dev/null 2>&1; then
    echo -e "   Port 8891 (Backend): ${GREEN}✅ ACTIVE${NC}"
    BACKEND_PID=$(lsof -ti :8891)
    echo -e "   Backend PID: ${YELLOW}$BACKEND_PID${NC}"
else
    echo -e "   Port 8891 (Backend): ${RED}❌ INACTIVE${NC}"
fi

# Frontend port (5173)
if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "   Port 5173 (Frontend): ${GREEN}✅ ACTIVE${NC}"
    FRONTEND_PID=$(lsof -ti :5173)
    echo -e "   Frontend PID: ${YELLOW}$FRONTEND_PID${NC}"
else
    echo -e "   Port 5173 (Frontend): ${RED}❌ INACTIVE${NC}"
fi

# Check conflicting ports
echo ""
echo -e "${BLUE}🚨 Port Conflict Check:${NC}"
if lsof -i :8889 > /dev/null 2>&1; then
    CONFLICT_PID=$(lsof -ti :8889)
    echo -e "   Port 8889 (Asset App): ${YELLOW}⚠️  IN USE (PID: $CONFLICT_PID)${NC}"
else
    echo -e "   Port 8889 (Asset App): ${GREEN}✅ FREE${NC}"
fi

# Database connection
echo ""
echo -e "${BLUE}🗄️  Database Status:${NC}"
if [ -f ".env" ]; then
    source .env
    if [ ! -z "$DATABASE_URL" ]; then
        # Extract database details
        DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
        DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
        DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
        DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
        
        echo -e "   Database Host: ${YELLOW}$DB_HOST:$DB_PORT${NC}"
        echo -e "   Database Name: ${YELLOW}$DB_NAME${NC}"
        echo -e "   Database User: ${YELLOW}$DB_USER${NC}"
        
        # Test connection
        if command -v psql &> /dev/null; then
            if PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
                echo -e "   Connection: ${GREEN}✅ CONNECTED${NC}"
            else
                echo -e "   Connection: ${RED}❌ FAILED${NC}"
            fi
        else
            echo -e "   Connection: ${YELLOW}⚠️  psql not available${NC}"
        fi
    else
        echo -e "   ${RED}❌ DATABASE_URL not configured${NC}"
    fi
else
    echo -e "   ${RED}❌ .env file not found${NC}"
fi

# System resources
echo ""
echo -e "${BLUE}💻 System Resources:${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo -e "   Python: ${GREEN}✅ v$PYTHON_VERSION${NC}"
else
    echo -e "   Python: ${RED}❌ Not installed${NC}"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>&1)
    echo -e "   Node.js: ${GREEN}✅ $NODE_VERSION${NC}"
else
    echo -e "   Node.js: ${RED}❌ Not installed${NC}"
fi

if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version 2>&1 | cut -d' ' -f3)
    echo -e "   PostgreSQL: ${GREEN}✅ v$PG_VERSION${NC}"
else
    echo -e "   PostgreSQL: ${RED}❌ Not installed${NC}"
fi

# Application URLs
echo ""
echo -e "${BLUE}🔗 Application URLs:${NC}"
echo -e "   Frontend:     ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend API:  ${BLUE}http://localhost:8891${NC}"
echo -e "   API Docs:     ${BLUE}http://localhost:8891/docs${NC}"

echo ""
echo -e "${YELLOW}💡 Quick Commands:${NC}"
echo -e "   Start:   ${BLUE}./start_dev.sh${NC}"
echo -e "   Stop:    ${BLUE}./stop_dev.sh${NC}"
echo -e "   Restart: ${BLUE}./restart_dev.sh${NC}"
echo -e "   Setup:   ${BLUE}./setup.sh${NC}"