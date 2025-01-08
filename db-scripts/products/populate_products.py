import os
from pymongo import MongoClient
import random
import uuid
from dotenv import load_dotenv
import sys
import requests
import base64
from datetime import datetime, timezone

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from reference.product_types import PRODUCT_TYPES

# Explicitly set the project root and .env path
PROJECT_ROOT = r'C:\Projects\Admin-Dashboard-ECommerce'
dotenv_path = os.path.join(PROJECT_ROOT, '.env')

# Load environment variables from the specific path
load_dotenv(dotenv_path)

# MongoDB connection details
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('MONGO_DB_NAME', 'ecommerce_admin_dashboard')
PRODUCTS_COLLECTION = 'products'

# Default "No Image" URL
NO_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'

def fetch_default_image():
    """
    Fetch the default 'No Image Available' image
    """
    try:
        # Download the image
        img_response = requests.get(NO_IMAGE_URL)
        
        # Convert to base64
        if img_response.status_code == 200:
            return base64.b64encode(img_response.content).decode('utf-8')
        
        return None
    
    except Exception as e:
        print(f"Error fetching default image: {e}")
        return None

# Function to generate product data
def generate_products(num_products=500):
    products = []
    
    # Fetch default image once to avoid repeated downloads
    default_image = fetch_default_image()
    
    for _ in range(num_products):
        # Randomly select category and product type
        category = random.choice(list(PRODUCT_TYPES.keys()))
        product_type, description = random.choice(PRODUCT_TYPES[category])
        
        # Weighted stock generation
        # 20% chance of low stock (0-20)
        # 60% chance of moderate stock (21-100)
        # 20% chance of high stock (101-250)
        stock_choice = random.choices(
            ['low', 'moderate', 'high'], 
            weights=[0.2, 0.6, 0.2]
        )[0]
        
        if stock_choice == 'low':
            stock = random.randint(0, 20)
        elif stock_choice == 'moderate':
            stock = random.randint(21, 100)
        else:
            stock = random.randint(101, 250)
        
        product_id = "PRODUCT-" + str(uuid.uuid4())
        current_time = datetime.now(timezone.utc)
        
        product = {
            '_id': product_id,
            'id': product_id,
            'name': product_type,
            'category': category,
            'price': round(random.betavariate(2, 5) * 50, 2),
            'stock': stock,
            'description': description,
            'image': default_image or NO_IMAGE_URL,
            'createdAt': current_time,
            'updatedAt': current_time,
            '__v': 0
        }
        products.append(product)
    
    return products

def populate_products():
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[PRODUCTS_COLLECTION]
        
        # Generate products
        products = generate_products()
        
        # Insert products
        if products:
            # Delete existing products before inserting new ones
            collection.delete_many({})
            
            # Insert new products
            result = collection.insert_many(products)
            
            print(f"Successfully inserted {len(result.inserted_ids)} products")
        
        client.close()
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    populate_products()