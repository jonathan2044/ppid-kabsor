#!/bin/bash

# PPID Kabsor - PostgreSQL Database Setup Script

echo "🐘 Setting up PostgreSQL Database for PPID Kabsor..."

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="ppid_kabsor_db"
DB_USER="ppid_user"
DB_PASSWORD="ppid_password"
DB_HOST="localhost"
DB_PORT="5432"

echo -e "${BLUE}📋 Database Configuration:${NC}"
echo -e "   Database: ${YELLOW}$DB_NAME${NC}"
echo -e "   User: ${YELLOW}$DB_USER${NC}"
echo -e "   Host: ${YELLOW}$DB_HOST${NC}"
echo -e "   Port: ${YELLOW}$DB_PORT${NC}"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed!${NC}"
    echo -e "${YELLOW}📝 Please install PostgreSQL first:${NC}"
    echo -e "   macOS: ${BLUE}brew install postgresql${NC}"
    echo -e "   Ubuntu: ${BLUE}sudo apt-get install postgresql postgresql-contrib${NC}"
    echo -e "   CentOS: ${BLUE}sudo yum install postgresql postgresql-server${NC}"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pgrep -x "postgres" > /dev/null; then
    echo -e "${YELLOW}🔄 Starting PostgreSQL service...${NC}"
    
    # Try different methods to start PostgreSQL
    if command -v brew &> /dev/null; then
        brew services start postgresql
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start postgresql
    elif command -v service &> /dev/null; then
        sudo service postgresql start
    else
        echo -e "${RED}❌ Could not start PostgreSQL service automatically${NC}"
        echo -e "${YELLOW}📝 Please start PostgreSQL manually and run this script again${NC}"
        exit 1
    fi
    
    sleep 3
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Create database and user
echo -e "${YELLOW}🗄️  Creating database and user...${NC}"

# Create user and database (using postgres superuser)
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || \
psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || \
createuser -U postgres $DB_USER 2>/dev/null

sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || \
psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || \
createdb -U postgres -O $DB_USER $DB_NAME 2>/dev/null

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || \
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null

echo -e "${GREEN}✅ Database and user created${NC}"

# Create .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
    
    # Update .env with correct database URL
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME|g" .env
    rm .env.bak 2>/dev/null
    
    echo -e "${GREEN}✅ .env file created and configured${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, please update manually if needed${NC}"
fi

# Test database connection
echo -e "${BLUE}🔍 Testing database connection...${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo -e "${YELLOW}📝 Please check your PostgreSQL configuration${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 PostgreSQL setup completed successfully!${NC}"
echo "================================================="
echo -e "${YELLOW}📝 Database Details:${NC}"
echo -e "   Database URL: ${BLUE}postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME${NC}"
echo -e "   Admin Access: ${BLUE}psql -h $DB_HOST -U $DB_USER -d $DB_NAME${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "1. Run: ${BLUE}./setup_backend.sh${NC} to setup Python backend"
echo -e "2. Run: ${BLUE}./start_dev.sh${NC} to start development servers"
echo -e "3. Access API docs at: ${BLUE}http://localhost:8891/docs${NC}"