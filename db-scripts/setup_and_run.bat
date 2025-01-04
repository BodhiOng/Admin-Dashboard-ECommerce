@echo off
setlocal enabledelayedexpansion

:: Set project root directory
set PROJECT_ROOT=C:\Projects\Admin-Dashboard-ECommerce

:: Create virtual environment
if not exist .venv (
    python -m venv .venv
)

:: Activate virtual environment
call .venv\Scripts\activate

:: Upgrade pip
python -m pip install --upgrade pip

:: Install requirements
pip install -r "%PROJECT_ROOT%\db-scripts\requirements.txt"

:: Run the populate products script
python "%PROJECT_ROOT%\db-scripts\products\populate_products.py"

:: Deactivate virtual environment
deactivate

:: Pause to see output (optional)
pause
