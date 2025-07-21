@echo off
echo Starting Git history cleaning process...

REM Install git-filter-repo if not already installed
pip install --user git-filter-repo

REM Create a backup branch
git branch backup-before-cleaning

REM Run the cleaning script
python clean_history.py

echo Git history cleaned!
echo Original history backed up in 'backup-before-cleaning' branch
echo You can now try pushing again with: git push -f origin deployment-branch
