#!/usr/bin/env python3
"""
Script to remove sensitive data from files
"""
import os
import re
import sys
import glob

# Patterns to search for and replace
patterns = {
    # Google OAuth Client ID
    r'(\d+)-([a-zA-Z0-9]+)\.apps\.googleusercontent\.com': 'REDACTED-GOOGLE-CLIENT-SECRETD.apps.googleusercontent.com',
    # Google OAuth Client Secret
    r'[a-zA-Z0-9_-]{24}': 'REDACTED-GOOGLE-CLIENT-SECRETECRET',
    # Generic API keys, tokens, etc.
    r'(api[_-]?key|auth[_-]?token|access[_-]?token|secret[_-]?key)["\']\s*[:=]\s*["\']([a-zA-Z0-9_\-\.]{16,64})["\']': r'\1 = "REDACTED-API-KEY"',
    # Connection strings
    r'(connectionstring|conn[_-]?str)["\']\s*[:=]\s*["\'](.*user.*password.*)["\']': r'\1 = "REDACTED-GOOGLE-CLIENT-SECRETNG"',
}

# Files to check (using glob patterns)
file_patterns = [
    '**/*.ps1',
    '**/*.py',
    '**/*.sh',
    '**/*.json',
    '**/*.yml',
    '**/*.yaml',
    '**/*.env*',
    '**/*.config'
]

def REDACTED-GOOGLE-CLIENT-SECRET(filepath):
    """Remove secrets from a single file"""
    print(f"Processing {filepath}...")
    try:
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
    print(f"Scanning for secrets in {root_dir}")
    
    # Process each file pattern
    for pattern in file_patterns:
        for filepath in glob.glob(os.path.join(root_dir, pattern), recursive=True):
            if os.path.isfile(filepath):
                REDACTED-GOOGLE-CLIENT-SECRET(filepath)

if __name__ == "__main__":
    main()
    print("Secret removal complete!")
