import os
from sqlalchemy.orm import Session
from Auth.models import UserReport
from Auth.database import SessionLocal

def update_file_sizes():
    db: Session = SessionLocal()
    reports = db.query(UserReport).filter(UserReport.file_size == None).all()
    for report in reports:
        if os.path.exists(report.filepath):
            size = os.path.getsize(report.filepath)
            report.file_size = size
            print(f"Updated {report.filename}: {size} bytes")
        else:
            print(f"File not found: {report.filepath}")
    db.commit()
    db.close()

if __name__ == "__main__":
    update_file_sizes()