#!/usr/bin/env python3
"""
Test both connection methods to determine which works with Azure
"""

def test_both_connections():
    connections_to_test = [
        {
            "name": "Direct Connection (Port 5432)",
            "url": "postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require"
        },
        {
            "name": "Pooled Connection (Port 6543)", 
            "url": "postgresql://postgres:Investimate_291@db.fryuuxrvtkijmxsrmytt.supabase.co:6543/postgres?sslmode=require"
        }
    ]
    
    print("🔍 Testing Supabase connection methods...")
    print("=" * 50)
    
    for conn in connections_to_test:
        print(f"\n📡 Testing: {conn['name']}")
        print(f"URL: {conn['url'][:50]}...")
        
        try:
            import psycopg2
            test_conn = psycopg2.connect(conn['url'])
            cursor = test_conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ SUCCESS: {version[0][:100]}...")
            cursor.close()
            test_conn.close()
            
            print(f"🎉 RECOMMENDED: Use this connection string in Azure!")
            return conn['url']
            
        except Exception as e:
            print(f"❌ FAILED: {e}")
    
    return None

if __name__ == "__main__":
    working_conn = test_both_connections()
    
    if working_conn:
        print(f"\n🎯 NEXT STEPS:")
        print(f"1. Update Azure App Service DATABASE_URL to use working connection")
        print(f"2. Restart the App Service")
        print(f"3. Monitor logs for successful database connection")
    else:
        print(f"\n❌ Both connections failed.")
        print(f"   This confirms it's a network/firewall issue.")
        print(f"   Add Azure IP ranges to Supabase Network Restrictions.")
