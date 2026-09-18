#!/bin/bash

# PPID Kabsor - Development Server Stopper

echo "🛑 Stopping PPID Kabsor Development Servers..."

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Killing FastAPI backend processes...${NC}"
pkill -f "uvicorn.*app.main:app" 2>/dev/null && echo -e "${GREEN}✅ Backend stopped${NC}" || echo -e "${RED}❌ No backend process found${NC}"

echo -e "${YELLOW}🔄 Killing Vite frontend processes...${NC}"
pkill -f "vite.*dev" 2>/dev/null && echo -e "${GREEN}✅ Frontend stopped${NC}" || echo -e "${RED}❌ No frontend process found${NC}"

# Kill any remaining Node processes from this project
pkill -f "node.*ppid-kabsor" 2>/dev/null

echo -e "${GREEN}✅ All development servers stopped!${NC}"