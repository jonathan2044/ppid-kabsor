#!/bin/bash

# PPID Kabsor - Complete Setup Script

echo "🚀 PPID Kabupaten Sorong - Complete Setup"
echo "========================================="

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 This script will setup:${NC}"
echo -e "   1. PostgreSQL database and user"
echo -e "   2. Python backend environment"
echo -e "   3. Node.js frontend dependencies"
echo -e "   4. Database tables and default admin user"
echo ""

read -p "Continue with setup? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Setup cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Step 1/3: Setting up PostgreSQL database...${NC}"
./setup_postgresql.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ PostgreSQL setup failed!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔄 Step 2/3: Setting up Python backend...${NC}"
./setup_backend.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend setup failed!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔄 Step 3/3: Making scripts executable...${NC}"
chmod +x *.sh

echo ""
echo -e "${GREEN}🎉 PPID Kabsor Setup Completed Successfully!${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}📋 Quick Start Commands:${NC}"
echo -e "   Start servers: ${BLUE}./start_dev.sh${NC}"
echo -e "   Stop servers:  ${BLUE}./stop_dev.sh${NC}"
echo -e "   Restart:       ${BLUE}./restart_dev.sh${NC}"
echo ""
echo -e "${YELLOW}🔗 Access Points:${NC}"
echo -e "   Frontend:     ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend API:  ${BLUE}http://localhost:8891${NC}"
echo -e "   API Docs:     ${BLUE}http://localhost:8891/docs${NC}"
echo ""
echo -e "${YELLOW}👤 Default Admin Login:${NC}"
echo -e "   Username: ${BLUE}admin${NC}"
echo -e "   Password: ${BLUE}admin123${NC}"
echo ""
echo -e "${GREEN}✅ Setup complete! Run ./start_dev.sh to begin development.${NC}"