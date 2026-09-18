#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update database enum values untuk kategori informasi
"""

import sys
sys.path.append('.')

from app.database import SessionLocal
from sqlalchemy import text
import psycopg2

def update_enum_values():
    db = SessionLocal()
    try:
        print("🔄 Updating enum values in database...")
        
        # First, let's see current enum values
        result = db.execute(text("SELECT unnest(enum_range(NULL::kategoriinformasienum))"))
        current_values = [row[0] for row in result.fetchall()]
        print(f"Current enum values: {current_values}")
        
        # Check if we need to add new values
        needed_values = ['serta-merta', 'setiap-saat', 'dikecualikan']
        missing_values = [val for val in needed_values if val not in current_values]
        
        if missing_values:
            print(f"Adding missing enum values: {missing_values}")
            
            # Add missing enum values
            for value in missing_values:
                try:
                    db.execute(text(f"ALTER TYPE kategoriinformasienum ADD VALUE '{value}'"))
                    db.commit()
                    print(f"  ✅ Added enum value: {value}")
                except Exception as e:
                    print(f"  ⚠️  Value {value} may already exist: {e}")
                    db.rollback()
        
        # Update existing data to use new enum values
        print("🔄 Updating existing data...")
        
        # Update serta_merta to serta-merta
        result = db.execute(text("""
            UPDATE informasi_publik 
            SET kategori = 'serta-merta'::kategoriinformasienum 
            WHERE kategori::text = 'serta_merta'
        """))
        if result.rowcount > 0:
            print(f"  ✅ Updated {result.rowcount} records: serta_merta -> serta-merta")
        
        # Update setiap_saat to setiap-saat  
        result = db.execute(text("""
            UPDATE informasi_publik 
            SET kategori = 'setiap-saat'::kategoriinformasienum 
            WHERE kategori::text = 'setiap_saat'
        """))
        if result.rowcount > 0:
            print(f"  ✅ Updated {result.rowcount} records: setiap_saat -> setiap-saat")
        
        db.commit()
        
        # Show final enum values
        result = db.execute(text("SELECT unnest(enum_range(NULL::kategoriinformasienum))"))
        final_values = [row[0] for row in result.fetchall()]
        print(f"✅ Final enum values: {final_values}")
        
        print("✅ Enum update completed!")
        
    except Exception as e:
        print(f"❌ Error updating enum: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_enum_values()