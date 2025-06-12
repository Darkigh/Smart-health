@echo off
echo ===================================================
echo Smart Health Assistant - Installation and Setup
echo ===================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    echo Minimum recommended version: 16.x or higher
    pause
    exit /b 1
)

echo Node.js is installed. Version:
node -v
echo.

REM Check if pnpm is installed, install if not
call pnpm --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing pnpm package manager...
    call npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install pnpm. Please run 'npm install -g pnpm' manually.
        pause
        exit /b 1
    )
    echo pnpm installed successfully.
) else (
    echo pnpm is already installed.
)
echo.

:MENU
echo Choose an option:
echo 1. Normal installation and start
echo 2. Troubleshooting (clear cache and reinstall)
echo 3. Exit
echo.
set /p OPTION="Enter option (1, 2, or 3): "

if "%OPTION%"=="1" goto NORMAL_INSTALL
if "%OPTION%"=="2" goto TROUBLESHOOT
if "%OPTION%"=="3" goto END

echo Invalid option. Please try again.
goto MENU

:NORMAL_INSTALL
REM Install dependencies
echo Installing project dependencies...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies. Please check your internet connection and try again.
    echo Consider using the troubleshooting option if this error persists.
    pause
    goto MENU
)
echo Dependencies installed successfully.
echo.
goto START_APP

:TROUBLESHOOT
echo ===================================================
echo Running troubleshooting steps...
echo ===================================================
echo.

echo Step 1: Clearing npm cache...
call npm cache clean --force
echo.

echo Step 2: Removing node_modules folder...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules folder removed.
) else (
    echo node_modules folder not found, skipping.
)
echo.

echo Step 3: Removing .vite cache folder...
if exist .vite (
    rmdir /s /q .vite
    echo .vite folder removed.
) else (
    echo .vite folder not found, skipping.
)
echo.

echo Step 4: Clearing pnpm store...
call pnpm store prune
echo.

echo Step 5: Reinstalling dependencies...
call pnpm install --force
if %ERRORLEVEL% NEQ 0 (
    echo Failed to reinstall dependencies.
    echo Please try running this script as administrator or check your internet connection.
    pause
    goto MENU
)
echo Dependencies reinstalled successfully.
echo.
goto START_APP

:START_APP
REM Start the development server
echo Starting the Smart Health Assistant application...
echo.
echo The application will open in your default browser.
echo Press Ctrl+C to stop the server when you're done.
echo.
echo If you encounter any file system errors, please:
echo 1. Close this window
echo 2. Run this batch file again and select the troubleshooting option
echo 3. Consider moving the project to a path without spaces or special characters
echo.
call pnpm dev

:END
pause
