@echo off
REM Windows App Service deployment script
echo Starting Windows deployment script

REM Install dependencies
echo Installing Python dependencies...
%HOME%\python\python.exe -m pip install --upgrade pip
%HOME%\python\python.exe -m pip install -r requirements.txt

REM Check if requirements_production.txt exists and install from it
if exist requirements_production.txt (
    echo Installing production dependencies...
    %HOME%\python\python.exe -m pip install -r requirements_production.txt
)

REM Test if FastAPI is installed
echo Testing FastAPI installation...
%HOME%\python\python.exe -c "import fastapi; print('FastAPI version:', fastapi.__version__)"

echo Deployment script completed
