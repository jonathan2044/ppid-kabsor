#!/bin/bash

# PPID Kabsor - Development Server Restarter

echo "🔄 Restarting PPID Kabsor Development Servers..."

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Stop existing servers
echo -e "${YELLOW}1. Stopping existing servers...${NC}"
./stop_dev.sh

# Wait a moment
echo -e "${YELLOW}2. Waiting 3 seconds...${NC}"
sleep 3

# Start servers again
echo -e "${BLUE}3. Starting servers again...${NC}"
./start_dev.sh