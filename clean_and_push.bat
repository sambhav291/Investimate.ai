@echo off
echo ===================================================
echo Fix GitHub Push Protection - Clean Approach
echo ===================================================
echo.

echo Step 1: Cleaning specific files with potential secrets...
python clean_specific_files.py
echo.

echo Step 2: Creating a fresh branch without history...
git checkout --orphan temp-clean-branch
echo.

echo Step 3: Adding all files to the new branch...
git add .
echo.

echo Step 4: Committing changes...
git commit -m "Clean repository without secrets"
echo.

echo Step 5: Backing up current branch (optional)...
git branch -m deployment-branch deployment-branch-backup
echo.

echo Step 6: Renaming our clean branch to deployment-branch...
git branch -m temp-clean-branch deployment-branch
echo.

echo Step 7: Force pushing to GitHub...
git push -f origin deployment-branch
echo.

echo ===================================================
echo Done! Repository should now be clean of secrets.
echo ===================================================
