#!/usr/bin/env python3
"""
Database connection tester for Azure deployment
"""
import os
import psycopg2
from urllib.parse import urlparse

def test_database_connection():
    # Test different connection string formats
    connection_strings = [
        "postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require",
        "postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:6543/postgres?sslmode=require"
    ]
    
    for i, conn_str in enumerate(connection_strings, 1):
        print(f"\n=== Testing Connection {i} ===")
        print(f"Connection string: {conn_str}")
        
        try:
            # Parse the connection string
            parsed = urlparse(conn_str)
            print(f"Host: {parsed.hostname}")
            print(f"Port: {parsed.port}")
            print(f"Database: {parsed.path[1:]}")  # Remove leading slash
            
            # Test connection
            conn = psycopg2.connect(conn_str)
            cursor = conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Connection successful!")
            print(f"Database version: {version[0]}")
            
            cursor.close()
            conn.close()
            return conn_str
            
        except Exception as e:
            print(f"❌ Connection failed: {e}")
    
    return None

if __name__ == "__main__":
    print("Testing database connections...")
    working_connection = test_database_connection()
    
    if working_connection:
        print(f"\n🎉 Use this connection string: {working_connection}")
    else:
        print("\n❌ All connections failed. Check network settings.")
