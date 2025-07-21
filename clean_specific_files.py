#!/usr/bin/env python3
"""
Script to remove sensitive data from key files only
"""
import os
import re
import sys

# Patterns to search for and replace
patterns = {
    # Google OAuth Client ID
    r'(\d+)-([a-zA-Z0-9]+)\.apps\.googleusercontent\.com': 'REDACTED-GOOGLE-CLIENT-ID.apps.googleusercontent.com',
    # Google OAuth Client Secret
    r'[a-zA-Z0-9_-]{24}': 'REDACTED-GOOGLE-CLIENT-SECRET',
    # Generic API keys, tokens, etc.
    r'(api[_-]?key|auth[_-]?token|access[_-]?token|secret[_-]?key)["\']\s*[:=]\s*["\']([a-zA-Z0-9_\-\.]{16,64})["\']': r'\1 = "REDACTED-API-KEY"',
    # Connection strings
    r'(connectionstring|conn[_-]?str)["\']\s*[:=]\s*["\'](.*user.*password.*)["\']': r'\1 = "REDACTED-CONNECTION-STRING"',
}

# Specific files to check (no recursive scanning)
specific_files = [
    'Backend/configure_azure_env.ps1',
    'Backend/secdat.py',
    'Backend/azure.yaml',
    'Backend/main.py',
    'Backend/application.py',
    'Backend/minimal_app.py',
    '.github/workflows/main_investimate-backend.yml'
]

def remove_secrets_from_file(filepath):
    """Remove secrets from a single file"""
    print(f"Processing {filepath}...")
    try:
        if not os.path.exists(filepath):
            print(f"ℹ️ File not found: {filepath}")
            return
            
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        for pattern, replacement in patterns.items():
            content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Removed secrets from {filepath}")
        else:
            print(f"ℹ️ No secrets found in {filepath}")
            
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")

def main():
    """Main function"""
    # Get the root directory (current directory)
    root_dir = os.getcwd()
    print(f"Scanning for secrets in specific files...")
    
    # Process each specific file
    for relative_path in specific_files:
        filepath = os.path.join(root_dir, relative_path)
        remove_secrets_from_file(filepath)

if __name__ == "__main__":
    main()
    print("Secret removal complete!")
