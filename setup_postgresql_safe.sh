#!/bin/bash

# PPID Kabsor - Safe PostgreSQL Setup (Tidak Mengubah Proyek Lain)

echo "🐘 PPID Kabsor - Safe PostgreSQL Setup"
echo "======================================"

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration untuk proyek ini saja
DB_NAME="ppid_kabsor_db"
DB_USER=$(whoami)  # Gunakan user sistem yang ada
DB_HOST="localhost"
DB_PORT="5432"

echo -e "${BLUE}📋 Database Configuration (Isolated):${NC}"
echo -e "   Database: ${YELLOW}$DB_NAME${NC} (khusus proyek PPID)"
echo -e "   User: ${YELLOW}$DB_USER${NC} (user sistem existing)"
echo -e "   Host: ${YELLOW}$DB_HOST${NC}"
echo -e "   Port: ${YELLOW}$DB_PORT${NC}"
echo ""
echo -e "${GREEN}✅ Tidak akan mengubah database atau user lain${NC}"
echo ""

# Test koneksi dengan user existing
echo -e "${BLUE}🔍 Testing existing PostgreSQL connection...${NC}"
if psql -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL connection successful with user '$DB_USER'${NC}"
else
    echo -e "${RED}❌ Cannot connect to PostgreSQL with user '$DB_USER'${NC}"
    echo -e "${YELLOW}📝 Please ensure PostgreSQL is running and user '$DB_USER' has access${NC}"
    exit 1
fi

# Create database untuk proyek ini saja (tidak mempengaruhi database lain)
echo -e "${YELLOW}🗄️  Creating isolated database for PPID project...${NC}"

# Check if database already exists
DB_EXISTS=$(psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists, skipping creation${NC}"
else
    psql -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database '$DB_NAME' created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create database '$DB_NAME'${NC}"
        exit 1
    fi
fi

# Test connection to the new database
echo -e "${BLUE}🔍 Testing connection to PPID database...${NC}"
if psql -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PPID database connection successful${NC}"
else
    echo -e "${RED}❌ Cannot connect to PPID database${NC}"
    exit 1
fi

# Create .env file with safe configuration
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file with safe configuration...${NC}"
    cat > .env << EOF
# PPID Kabupaten Sorong - Safe Configuration
# Database terisolasi untuk proyek ini saja

# Database Configuration (Isolated - tidak mempengaruhi proyek lain)
DATABASE_URL=postgresql://$DB_USER@localhost:5432/$DB_NAME

# Backend Configuration (Port berbeda dari asset app)
BACKEND_PORT=8891
FASTAPI_URL=http://localhost:8891

# Security Configuration
SESSION_SECRET=ppid-kabsor-2024-secret-key-change-this-in-production

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif

# Development Settings
DEBUG=true
LOG_LEVEL=info
ENVIRONMENT=development

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8891
EOF
    echo -e "${GREEN}✅ .env file created with safe configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

# Final test
echo -e "${BLUE}🔍 Final database connection test...${NC}"
source .env
if psql -d $DB_NAME -c "SELECT current_database(), current_user;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ All database tests passed${NC}"
    echo ""
    echo -e "${GREEN}🎉 Safe PostgreSQL setup completed!${NC}"
    echo "=================================="
    echo -e "${YELLOW}📋 Project Database Details:${NC}"
    echo -e "   Database: ${BLUE}$DB_NAME${NC} (isolated for PPID project)"
    echo -e "   User: ${BLUE}$DB_USER${NC} (existing system user)"
    echo -e "   URL: ${BLUE}postgresql://$DB_USER@localhost:5432/$DB_NAME${NC}"
    echo ""
    echo -e "${GREEN}✅ Proyek lain tidak terpengaruh${NC}"
    echo -e "${YELLOW}📝 Next: Run ./setup_backend.sh to continue${NC}"
else
    echo -e "${RED}❌ Database connection test failed${NC}"
    exit 1
fi