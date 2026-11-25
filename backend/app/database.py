from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get database URL from environment - PostgreSQL required
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("⚠️  DATABASE_URL not set! Please configure PostgreSQL database.")
    print("💡 Example: DATABASE_URL=postgresql://ppid_user:ppid_password@localhost:5432/ppid_kabsor_db")
    raise ValueError("DATABASE_URL environment variable is required")

# Validate PostgreSQL URL
if not DATABASE_URL.startswith("postgresql://"):
    print("❌ Invalid database URL! Must use PostgreSQL.")
    print("💡 Example: DATABASE_URL=postgresql://ppid_user:ppid_password@localhost:5432/ppid_kabsor_db")
    raise ValueError("Only PostgreSQL databases are supported")

print(f"🗄️  Database: PostgreSQL")
print(f"🔗 Host: {DATABASE_URL.split('@')[1].split('/')[0] if '@' in DATABASE_URL else 'localhost'}")

# Create PostgreSQL engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set to True for SQL query debugging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_db_connection():
    """Test database connection"""
    try:
        from sqlalchemy import text
        db = SessionLocal()
        # Try a simple query to test connection
        db.execute(text("SELECT 1"))
        db.close()
        return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False


def ensure_schema_updates():
    """Penyesuaian skema yang tidak bisa dilakukan Base.metadata.create_all().

    create_all() hanya membuat tabel baru, tidak menambah kolom ke tabel yang
    sudah ada. Proyek ini belum memakai Alembic, jadi perubahan kolom dijalankan
    di sini secara idempotent (aman dijalankan berulang kali).
    """
    from sqlalchemy import text
    statements = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE",
    ]
    with engine.begin() as conn:
        for statement in statements:
            conn.execute(text(statement))
