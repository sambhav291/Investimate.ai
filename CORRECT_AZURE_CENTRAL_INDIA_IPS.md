# Correct Azure Central India IP Ranges for Supabase

## Current Problem
Your Supabase Network Restrictions have INCORRECT IP ranges that don't match Azure Central India.

## REMOVE These (Currently in your Supabase):
- `20.192.0.0/18` ❌
- `52.172.0.0/16` ❌
- `104.211.0.0/16` ❌
- `20.192.64.0/19` ❌
- `20.192.96.0/20` ❌

## ADD These (Correct Azure Central India ranges):
- `20.192.32.0/19` ✅
- `20.192.64.0/18` ✅
- `40.80.48.0/20` ✅
- `52.172.0.0/16` ✅
- `104.211.0.0/16` ✅
- `20.204.192.0/18` ✅

## Steps to Fix:

1. **In Supabase Dashboard:**
   - Go to Settings → Network Restrictions
   - Click "Remove" on all current entries
   - Click "Add restriction" for each correct range above
   - Click "Allow all access" temporarily if needed for testing

2. **Alternative (Recommended for testing):**
   - Click "Allow all access" button to temporarily disable restrictions
   - Test your Azure app connectivity
   - Once working, re-enable with correct ranges

3. **Test the connection:**
   - Deploy your app
   - Check Azure App Service logs
   - Look for "✅ Network connectivity to database: OK"

## Why This Matters:
Azure App Service in Central India uses specific IP ranges for outbound connections. Your current ranges don't include these IPs, so Supabase is blocking your Azure app's connection attempts.
