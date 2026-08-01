@echo off
color 0A
title GoFabrikos Setup - Please Wait...

echo.
echo  ================================================
echo     GoFabrikos Website - Automatic Setup
echo     Naari Fashions Pvt Ltd
echo  ================================================
echo.
echo  This will install all required packages.
echo  Please keep this window open until it finishes.
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ERROR: Node.js is not installed!
    echo.
    echo  Please install Node.js first:
    echo  1. Open your browser
    echo  2. Go to: https://nodejs.org
    echo  3. Click "LTS" to download
    echo  4. Install it (keep clicking Next)
    echo  5. RESTART your computer
    echo  6. Then double-click this file again
    echo.
    pause
    exit /b 1
)

echo  [OK] Node.js found:
node --version
echo.

:: Install all npm packages
echo  Installing packages (this takes 3-5 minutes)...
echo  Please wait...
echo.
npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  ERROR: Package installation failed.
    echo  Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo     SUCCESS! GoFabrikos is ready!
echo  ================================================
echo.
echo  Starting the website now...
echo.
echo  Once started, open your browser and go to:
echo.
echo       http://localhost:3000
echo.
echo  You should see the GoFabrikos website!
echo.
echo  To stop the website: Press Ctrl+C in this window
echo.
echo  ================================================
echo.

:: Start the development server
npm run dev

pause
