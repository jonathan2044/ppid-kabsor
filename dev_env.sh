#!/bin/bash

# PPID Kabsor - Environment Configuration
# File ini secara otomatis diload oleh script development

# ============================================
# PPID KABSOR DEVELOPMENT ENVIRONMENT
# ============================================

# Database Configuration (Auto-detected)
export DATABASE_URL="postgresql://akazaya@localhost:5432/ppid_kabsor_db"

# Backend Configuration  
export BACKEND_PORT=8891
export FASTAPI_URL="http://localhost:8891"

# Frontend Configuration
export FRONTEND_PORT=5173
export VITE_API_URL="http://localhost:8891"

# Python Environment
export PYTHON_ENV_PATH="/Users/akazaya/project/ppid-kabsor/backend/venv"
export PYTHONPATH="/Users/akazaya/project/ppid-kabsor/backend"

# Development Flags
export NODE_ENV="development"
export ENVIRONMENT="development"
export DEBUG=1

# Colors for terminal output
export RED='\033[0;31m'
export GREEN='\033[0;32m'  
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export NC='\033[0m'

echo -e "${GREEN}✅ PPID Kabsor environment loaded${NC}"
echo -e "${BLUE}   Database: ${DATABASE_URL}${NC}"
echo -e "${BLUE}   Backend Port: ${BACKEND_PORT}${NC}"
echo -e "${BLUE}   Python Env: ${PYTHON_ENV_PATH}${NC}"