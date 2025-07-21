
#!/usr/bin/env python3
import re
import sys
from git_filter_repo import FilteringOptions, RepoFilter

patterns = [
    # Google OAuth Client ID
    re.compile(rb'(\d+)-([a-zA-Z0-9]+)\.apps\.googleusercontent\.com'),
    # Google OAuth Client Secret
    re.compile(rb'[a-zA-Z0-9_-]{24}'),
    # Generic placeholders to replace other patterns
    re.compile(rb'(api[_-]?key|auth[_-]?token|access[_-]?token|secret[_-]?key)["']?\s*[:=]\s*["']([a-zA-Z0-9_\-\.]{16,64})["']'),
    re.compile(rb'(connectionstring|conn[_-]?str)["']?\s*[:=]\s*["'](.+user.*password.+)["']'),
]

replacements = [
    lambda m: b'REDACTED-GOOGLE-CLIENT-SECRETD.apps.googleusercontent.com',
    lambda m: b'REDACTED-GOOGLE-CLIENT-SECRETECRET',
    lambda m: m.group(1) + b' = "REDACTED-API-KEY"',
    lambda m: m.group(1) + b' = "REDACTED-GOOGLE-CLIENT-SECRETNG"',
]

def clean_content(content):
    for i, pattern in enumerate(patterns):
        content = pattern.sub(replacements[i], content)
    return content

def blob_callback(blob, callback_metadata):
    blob.data = clean_content(blob.data)

filter_options = FilteringOptions(
    blob_callback=blob_callback,
    force=True
)

RepoFilter(filter_options).run()
