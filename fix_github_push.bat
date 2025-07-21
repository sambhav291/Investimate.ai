@echo off
echo Starting to fix GitHub push protection issues...

REM First, run the script to remove secrets from current files
echo Removing secrets from current files...
python remove_secrets.py

REM Create a new branch for clean history
echo Creating a new clean branch...
git checkout --orphan clean-branch

REM Add all files to the new branch
echo Adding files to the new branch...
git add .

REM Commit the changes
echo Committing files to the new branch...
git commit -m "Initial clean commit without secrets"

REM List current branches
echo Current branches:
git branch

REM Push the new branch to GitHub, forcing to overwrite remote branch if it exists
echo Pushing clean branch to GitHub...
git push -f origin clean-branch:deployment-branch

echo Done! Your code should now be pushed without triggering push protection.
echo If you want to continue working on this branch, run:
echo git checkout -b deployment-branch clean-branch
echo git branch -d clean-branch
