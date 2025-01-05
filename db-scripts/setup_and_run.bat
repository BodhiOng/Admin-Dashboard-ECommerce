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
python "%PROJECT_ROOT%\db-scripts\orders\populate_orders.py"
python "%PROJECT_ROOT%\db-scripts\admins\populate_admins.py"

:: Deactivate virtual environment
deactivate