@echo off
setlocal enabledelayedexpansion

:: Prompt for the repository name
set /p repo_name=Enter the name of the GitHub repository: 

:: Prompt for the repository description
set /p repo_description=Enter a description for the repository (or leave blank): 

:: Prompt for the visibility (public/private)
set /p visibility=Should the repository be public or private? (public/private): 

:: Validate visibility
if /i not "!visibility!"=="public" if /i not "!visibility!"=="private" (
    echo Invalid visibility option. Defaulting to private.
    set visibility=private
)

:: Check if GitHub CLI is installed
where gh >nul 2>nul
if errorlevel 1 (
    echo GitHub CLI (gh) is not installed. Please install it first.
    exit /b 1
)

:: Create GitHub repository
echo Creating GitHub repository...
gh repo create %repo_name% --description "%repo_description%" --%visibility%

:: Initialize Git repository locally
echo Initializing local Git repository...
git init

:: Create .gitignore for node_modules
echo node_modules/ > .gitignore
echo .gitignore created to ignore node_modules/

:: Stage all files
git add .

:: Commit changes
git commit -m "Initial commit"

:: Add GitHub remote
for /f "tokens=*" %%i in ('gh auth status -h ^| find "Logged in to"') do set github_user=%%i
set github_user=%github_user:*Logged in to https://github.com/ =%
git remote add origin https://github.com/%github_user%/%repo_name%.git

:: Push files to GitHub
git branch -M main
git push -u origin main

echo Repository '%repo_name%' created and pushed to GitHub successfully!
