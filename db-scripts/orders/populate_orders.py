import random
import uuid
from datetime import datetime, timedelta, timezone
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import sys

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from reference.malaysian_names import FIRST_NAMES, LAST_NAMES

# Explicitly set the project root and .env path
PROJECT_ROOT = r'C:\Projects\Admin-Dashboard-ECommerce'
dotenv_path = os.path.join(PROJECT_ROOT, '.env')

# Load environment variables from the specific path
load_dotenv(dotenv_path)

# MongoDB connection details
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('MONGO_DB_NAME', 'ecommerce_admin_dashboard')
PRODUCTS_COLLECTION = 'products'
ORDERS_COLLECTION = 'orders'

# Order status types
ORDER_STATUSES = [
    'Pending', 
    'Processing', 
    'Completed'
]

def generate_customer_name():
    """
    Generate a random customer name
    """
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    return f"{first_name} {last_name}"

def fetch_products():
    """
    Fetch existing products from the database
    """
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        products_collection = db[PRODUCTS_COLLECTION]
        
        # Fetch all products
        products = list(products_collection.find({}, {'_id': 1, 'name': 1, 'price': 1}))
        
        client.close()
        return products
    
    except Exception as e:
        print(f"Error fetching products: {e}")
        return []

def generate_date():
    """
    Generate a date between 2020 and 2025,
    ensuring at least one order per month
    """
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2025, 1, 1)
    
    # Calculate total months
    total_months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
    
    # Create a list of all months
    all_months = [
        start_date + timedelta(days=30*i) 
        for i in range(total_months)
    ]
    
    # Randomly select a month
    selected_month = random.choice(all_months)
    
    # Randomly select a day within that month
    days_in_month = (selected_month.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
    random_day = random.randint(1, days_in_month.day)
    
    return selected_month.replace(day=random_day).strftime('%Y-%m-%d')

def generate_orders(num_orders=500, products=None):
    """
    Generate a list of sample orders with specific structure
    """
    if not products:
        products = fetch_products()
    
    if not products:
        print("No products available to generate orders.")
        return []
    
    # Track orders per month to ensure at least 20 per month
    orders_per_month = {}
    orders = []
    
    while len(orders) < num_orders:
        # Randomly select one unique product for the order
        product = random.choice(products)
        
        # Randomly determine quantity (1 to 5)
        quantity = random.randint(1, 5)
        
        # Calculate total price
        total_price = product['price'] * quantity
        
        # Generate a date
        order_date = generate_date()
        
        # Ensure at least 20 orders per month
        month_key = order_date[:7]  # Takes "YYYY-MM"
        if month_key not in orders_per_month:
            orders_per_month[month_key] = 0
        
        # Ensure minimum order count per month (30 orders) and total order required (500 orders)
        if orders_per_month[month_key] < 30 or len(orders) < num_orders:
            order_products = [{
                'product_name': product['name'],
                'product_id': product['_id'],
                'product_quantity': quantity
            }]
            
            order_id = "ORDER-" + str(uuid.uuid4())
            current_time = datetime.now(timezone.utc)
            
            order = {
                '_id': order_id,
                'id': order_id,
                'customer': generate_customer_name(),
                'date': order_date,
                'total': round(total_price, 2),
                'status': random.choice(ORDER_STATUSES),
                'products': order_products,
                'createdAt': current_time,
                'updatedAt': current_time,
                '__v': 0
            }
            
            orders.append(order)
            orders_per_month[month_key] += 1
    
    return orders

def populate_orders():
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        orders_collection = db[ORDERS_COLLECTION]
        
        # Fetch products
        products = fetch_products()
        
        # Generate orders
        orders = generate_orders(num_orders=1000, products=products)
        
        # Insert orders
        if orders:
            # Delete existing orders before inserting new ones
            orders_collection.delete_many({})
            
            # Insert new orders
            result = orders_collection.insert_many(orders)
            
            print(f"Successfully inserted {len(result.inserted_ids)} orders")
        
        client.close()
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    populate_orders()