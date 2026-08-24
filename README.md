# SOC Incident & Asset Management System

A proof-of-concept SOC asset management application with a Python CLI and a React/Vite dashboard. The project registers and stores security assets for laptops, servers, and firewalls.

## Project Overview

This repository contains a Python command-line application and a browser-based blue-team asset console. Together they are designed to:

- collect asset details for laptops, servers, and firewalls
- store asset records in separate text files
- support a basic authorization check for admin or SOC manager roles
- display stored asset information from asset files
- provide a dashboard for reviewing asset coverage, status, and triage needs
- register and edit assets from the browser workspace

## Current Features

- Basic user authorization for `admin` and `SOC manager`
- Authentication simulation using `asyncio.sleep()`
- Asset registration workflow for:
  - Laptop
  - Server
  - Firewall
- Object-oriented design using:
  - `Asset` base class
  - `Laptop`, `Server`, `Firewall` subclasses
  - `super()` calls for inheritance
  - `@classmethod` methods for collecting asset-specific input
- Asset-specific attributes captured for each asset type
- Automatic creation of `asset_main_directory` using `pathlib.Path`
- Separate asset storage files:
  - `Laptop_assets.txt`
  - `Server_assets.txt`
  - `Firewall_assets.txt`
- Resource viewing functionality that reads asset files and prints stored records
- File existence checks using `Path.exists()`
- Reading asset records using `readlines()`
- Parsing stored asset strings using string operations and dictionaries
- Basic command-line menu for selecting work actions

## Project Structure

The repository includes:

- `SOC Incident & Asset Management System/project.py` — main Python CLI application
- `asset1/` — sample JSON inventory records used by the frontend
- `frontend/` — React/Vite blue-team asset dashboard
- `frontend/src/main.jsx` — dashboard components and inventory behavior
- `frontend/src/styles.css` — responsive dashboard styling
- `README.md` — project documentation

The Python CLI creates `asset_main_directory/` at runtime to store text-based asset files.

## Getting Started

### Requirements

- Python 3.x
- No external dependencies; the project uses only the Python standard library.

### Run the Application

1. Open a terminal in the project folder:
   `SOC Incident & Asset Management System`
2. Run:
   ```bash
   python project.py
   ```
3. Follow the command-line prompts to authorize, authenticate, and register or view assets.

### Run the Frontend

Requirements: Node.js and npm.

1. Open a terminal in the `frontend` folder:
  ```bash
  cd frontend
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Start the development server:
  ```bash
  npm run dev
  ```
4. Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

Create a production bundle with:

```bash
npm run build
```

The dashboard loads sample JSON records from `asset1/`. New records and browser edits are stored in local storage; the Python CLI remains independent and continues to use file-based storage.

## Usage

- Start the program and identify as `admin` or `SOC manager`
- Choose between asset registration and asset viewing
- Enter the requested asset details when registering laptops, servers, or firewalls
- Stored asset records are written to files in `asset_main_directory`

## Learning Objectives

This project demonstrates the following Python concepts:

- Python classes and objects
- Inheritance and subclassing
- Class methods for alternate constructors
- File handling with `open()` and text files
- `pathlib.Path` for filesystem paths and directory creation
- Basic string parsing and dictionary construction
- Command-line interaction with `input()`
- Asynchronous sleep simulation with `asyncio`

## Future Improvements

Potential enhancements for this project include:

- Asset search and lookup by attribute
- Asset update and delete operations
- Stronger authentication and user session handling
- Database integration for structured storage
- Web interface or dashboard for SOC workflows
- API/backend integration for automation

## Disclaimer

This is an educational portfolio project. It uses dummy inputs and file-based storage, and it should not be used to manage real organizational asset data without significant hardening and validation.
