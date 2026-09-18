#!/bin/bash

# PPID Kabsor - Backend Setup Script (PostgreSQL Required)

echo "� Setting up PPID Kabsor Backend..."

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}📝 Please run ./setup_postgresql.sh first to setup database and .env file${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check if DATABASE_URL is configured
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"username:password"* ]]; then
    echo -e "${RED}❌ DATABASE_URL not properly configured in .env file!${NC}"
    echo -e "${YELLOW}📝 Please run ./setup_postgresql.sh first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env file found and configured${NC}"

# Setup Python environment
echo -e "${BLUE}🐍 Setting up Python environment...${NC}"
cd backend

# Check if Python is available
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python is not installed!${NC}"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating Python virtual environment...${NC}"
    $PYTHON_CMD -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}🔄 Activating virtual environment...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "${YELLOW}📦 Upgrading pip...${NC}"
pip install --upgrade pip

# Install dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo -e "${YELLOW}⚠️  requirements.txt not found, installing base packages...${NC}"
    pip install \
        fastapi \
        uvicorn[standard] \
        sqlalchemy \
        psycopg2-binary \
        python-jose[cryptography] \
        passlib[bcrypt] \
        python-multipart \
        email-validator \
        pydantic \
        pydantic-settings \
        python-dotenv
fi

# Initialize database tables
echo -e "${BLUE}🗄️  Initializing database tables...${NC}"
$PYTHON_CMD -c "
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv('../.env')

from app.database import engine, Base
from app import models

print('🔄 Creating database tables...')
try:
    Base.metadata.create_all(bind=engine)
    print('✅ Database tables created successfully!')
    
    # Create default admin user
    from app.database import SessionLocal
    from app.models import User, RoleEnum
    from app.auth import get_password_hash
    
    db = SessionLocal()
    
    # Check if admin user exists
    admin_exists = db.query(User).filter(User.username == 'admin').first()
    if not admin_exists:
        print('👤 Creating default admin user...')
        admin_user = User(
            username='admin',
            email='admin@sorongkab.go.id',
            password=get_password_hash('admin123'),
            nama_lengkap='Administrator PPID Kabupaten Sorong',
            role=RoleEnum.admin
        )
        db.add(admin_user)
        db.commit()
        print('✅ Default admin user created!')
        print('   Username: admin')
        print('   Password: admin123')
    else:
        print('👤 Admin user already exists')
    
    db.close()
    
except Exception as e:
    print(f'❌ Error initializing database: {e}')
    sys.exit(1)
"

cd ..

# Setup Node.js environment
echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
if [ -f "package.json" ]; then
    npm install
else
    echo -e "${YELLOW}⚠️  package.json not found, skipping Node.js setup${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Backend setup completed successfully!${NC}"
echo "================================================="
echo -e "${YELLOW}📝 Default Admin Account:${NC}"
echo -e "   Username: ${BLUE}admin${NC}"
echo -e "   Password: ${BLUE}admin123${NC}"
echo -e "   Email: ${BLUE}admin@sorongkab.go.id${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "1. Run: ${BLUE}./start_dev.sh${NC} to start development servers"
echo -e "2. Access API docs at: ${BLUE}http://localhost:8891/docs${NC}"
echo -e "3. Login to admin panel with the credentials above"