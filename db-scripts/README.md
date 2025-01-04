# Product Database Population Script

## Prerequisites
- Python 3.8+
- MongoDB running locally or with a remote connection

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure MongoDB Connection:
- Copy `.env.example` to `.env`
- Edit `.env` with your MongoDB connection details

## Usage
```bash
python populate_products.py
```

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `MONGO_DB_NAME`: Database name
- `MONGO_COLLECTION`: Collection name for products

## Features
- Generates 50 random products
- Supports multiple categories
- Randomizes:
  - Product names
  - Prices
  - Stock levels
  - Descriptions

## Notes
- Existing products will be deleted before insertion
- Requires an active MongoDB instance
