#!/usr/bin/env python3
"""
Secret Remover Script

This script removes or masks secrets from configuration files to enable safe GitHub pushing
"""

import os
import re
from pathlib import Path

def mask_secret(secret, visible_chars=4):
    """Mask a secret value, showing only the first and last few characters"""
    if not secret or len(secret) <= visible_chars * 2:
        return "**PLACEHOLDER**"
    return f"{secret[:visible_chars]}...{secret[-visible_chars:]}"

def process_file(file_path, replacements):
    """Process a file and replace secrets with placeholders"""
    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Apply all replacements
        original_content = content
        for pattern, replacement in replacements.items():
            content = re.sub(pattern, replacement, content)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Processed {file_path}")
            return True
        else:
            print(f"⏭️ No changes needed for {file_path}")
            return False
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    print("🔒 Secret Remover Tool")
    print("=" * 50)
    
    # Define patterns to replace (regex pattern -> replacement)
    replacements = {
        # Google Client ID
        r'REDACTED-GOOGLE-CLIENT-SECRETjgh29mv1i4iv1d931ijts\.apps\.googleusercontent\.com': 
            '**REDACTED-GOOGLE-CLIENT-SECRETLDER**',
        
        # Google Client Secret
        r'REDACTED-GOOGLE-CLIENT-SECRETl81KCZ9ivys': 
            '**REDACTED-GOOGLE-CLIENT-SECRETCEHOLDER**',
        
        # OpenRouter Key
        r'REDACTED-GOOGLE-CLIENT-SECRETREDACTED-GOOGLE-CLIENT-SECRETREDACTED-GOOGLE-CLIENT-SECRET6': 
            '**REDACTED-GOOGLE-CLIENT-SECRETER**',
        
        # Gemini Key
        r'REDACTED-GOOGLE-CLIENT-SECRETDdzk1VkdbZkzNzY': 
            '**GEMINI-KEY-PLACEHOLDER**',
        
        # Supabase Service Key (JWT)
        r'REDACTED-GOOGLE-CLIENT-SECRETcCI6IkpXVCJ9\.REDACTED-GOOGLE-CLIENT-SECRETREDACTED-GOOGLE-CLIENT-SECRETREDACTED-GOOGLE-CLIENT-SECRETREDACTED-GOOGLE-CLIENT-SECRETREDACTED-GOOGLE-CLIENT-SECRETcCI6MjA2NTc0Mjg3OH0\.REDACTED-GOOGLE-CLIENT-SECRETHdmfCEQyHi-34lU7JWs': 
            '**REDACTED-GOOGLE-CLIENT-SECRETCEHOLDER**',
        
        # Database URL with password
        r'postgresql://postgres:Investimate_291@db\.fryuuxrvtkijmxsrmytt\.supabase\.co:5432/postgres\?sslmode=require': 
            'postgresql://postgres:**DB-PASSWORD-PLACEHOLDER**@db.fryuuxrvtkijmxsrmytt.supabase.co:5432/postgres?sslmode=require',
        
        # Secret Key
        r'REDACTED-GOOGLE-CLIENT-SECRETRpJZpbS3RQD0gPbdH9s': 
            '**SECRET-KEY-PLACEHOLDER**'
    }
    
    # Files to process
    files_to_process = [
        "Backend/manual_azure_config.md",
        "Backend/AZURE_CONFIG_COMPLETE.md",
        "Backend/infra/main.parameters.json"
    ]
    
    # Process each file
    current_dir = Path.cwd()
    root_dir = current_dir
    
    # If we're in Backend directory, go up one level
    if current_dir.name == 'Backend':
        root_dir = current_dir.parent
    
    processed_count = 0
    for file_path in files_to_process:
        full_path = root_dir / file_path
        if full_path.exists():
            if process_file(full_path, replacements):
                processed_count += 1
        else:
            print(f"❌ File not found: {full_path}")
    
    print(f"\n✅ Successfully processed {processed_count} files")
    print("🔒 Secrets have been masked. You can now safely commit and push to GitHub.")
    print("⚠️ Remember to restore actual values in your local environment if needed.")

if __name__ == "__main__":
    main()
