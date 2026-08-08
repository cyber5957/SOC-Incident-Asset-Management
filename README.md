# SOC Incident & Asset Management System

A Python-based proof-of-concept SOC asset management application. This project registers and stores organizational security assets using object-oriented design and file-based persistence.

## Project Overview

This repository contains a simple SOC Incident & Asset Management System written in Python. The application is designed to:

- collect asset details for laptops, servers, and firewalls
- store asset records in separate text files
- support a basic authorization check for admin or SOC manager roles
- display stored asset information from asset files

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

The repository currently includes:

- `project.py` — main application script
- `asset_main_directory/` — folder created at runtime to store asset files
- `README.md` — project documentation

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
