from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def normalize_supabase_path(path: str) -> str:
    """
    Normalize a path for Supabase storage by removing leading ./ and ensuring
    it's relative to the bucket root.
    """
    if not path:
        return path
    
    # Remove leading ./ or ./
    if path.startswith('./'):
        path = path[2:]
    elif path.startswith('.\\'):
        path = path[2:]
    
    # Remove leading / if present
    if path.startswith('/'):
        path = path[1:]
    
    # Ensure forward slashes for Supabase
    path = path.replace('\\', '/')
    
    return path

def upload_pdf_to_supabase(local_path, dest_path=None):
    """
    Upload a local PDF file to Supabase storage.
    
    Args:
        local_path (str): Path to the local PDF file
        dest_path (str, optional): Destination path in Supabase. If None, uses basename of local_path
    
    Returns:
        str: The normalized destination path in Supabase storage, or None if upload failed
    """
    try:
        # Validate inputs
        if not local_path or not os.path.exists(local_path):
            print(f"[ERROR] Local file does not exist: {local_path}")
            return None
        
        if dest_path is None:
            dest_path = os.path.basename(local_path)
        
        # Normalize the destination path
        dest_path = normalize_supabase_path(dest_path)
        
        print(f"[Supabase] Uploading {local_path} to {dest_path}")
        
        # Try to remove existing file (ignore errors if file doesn't exist)
        try:
            supabase.storage.from_(SUPABASE_BUCKET).remove([dest_path])
            print(f"[Supabase] Removed existing file: {dest_path}")
        except Exception as e:
            print(f"[Supabase] Remove error (ignored): {e}")
        
        # Upload the file
        with open(local_path, "rb") as f:
            file_content = f.read()
            if len(file_content) == 0:
                print(f"[ERROR] Local file is empty: {local_path}")
                return None
            
            print(f"[Supabase] Uploading file of size: {len(file_content)} bytes")
            
            result = supabase.storage.from_(SUPABASE_BUCKET).upload(dest_path, f)
            print(f"[Supabase] Upload result: {result}")
            
        print(f"[Supabase] Successfully uploaded file to: {dest_path}")
        return dest_path
        
    except Exception as e:
        print(f"[ERROR] Supabase upload error: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_signed_url(dest_path, expires_in=3600):
    """
    Create a signed URL for accessing a file in Supabase storage.
    
    Args:
        dest_path (str): Path to the file in Supabase storage
        expires_in (int): URL expiration time in seconds (default: 1 hour)
    
    Returns:
        str: The signed URL, or None if creation failed
    """
    try:
        if not dest_path:
            print(f"[ERROR] Empty destination path provided")
            return None
        
        # Normalize the path
        normalized_path = normalize_supabase_path(dest_path)
        print(f"[Supabase] Creating signed URL for: {normalized_path}")
        
        res = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(normalized_path, expires_in)
        
        if res and 'signedURL' in res:
            signed_url = res['signedURL']
            print(f"[Supabase] Created signed URL: {signed_url}")
            return signed_url
        else:
            print(f"[ERROR] Invalid response from create_signed_url: {res}")
            return None
            
    except Exception as e:
        print(f"[ERROR] Failed to create signed URL for {dest_path}: {e}")
        import traceback
        traceback.print_exc()
        return None

def check_file_exists(dest_path):
    """
    Check if a file exists in Supabase storage.
    
    Args:
        dest_path (str): Path to check in Supabase storage
    
    Returns:
        bool: True if file exists, False otherwise
    """
    try:
        normalized_path = normalize_supabase_path(dest_path)
        files = supabase.storage.from_(SUPABASE_BUCKET).list(os.path.dirname(normalized_path) or "")
        filename = os.path.basename(normalized_path)
        
        for file_info in files:
            if file_info['name'] == filename:
                return True
        return False
        
    except Exception as e:
        print(f"[ERROR] Failed to check file existence for {dest_path}: {e}")
        return False


