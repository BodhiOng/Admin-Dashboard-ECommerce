import os
import sys
import uuid
import random
import bcrypt
import requests
import base64
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone

# Add parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from reference.malaysian_names import FIRST_NAMES, LAST_NAMES
from reference.malaysian_addresses import STREET_NAMES, STREET_TYPES, STATES_AND_DISTRICTS

# Explicitly set the project root and .env path
PROJECT_ROOT = r'C:\Projects\Admin-Dashboard-ECommerce'
dotenv_path = os.path.join(PROJECT_ROOT, '.env')

# Load environment variables from the specific path
load_dotenv(dotenv_path)

# MongoDB connection details
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('MONGO_DB_NAME', 'ecommerce_admin_dashboard')
ADMINS_COLLECTION = 'admins'

# Admin roles
ADMIN_ROLES = [
    'Current Admin', 
    'Admin Applicant', 
]

def generate_phone_number():
    """Generate a random Malaysian phone number"""
    # Malaysian mobile prefixes
    prefixes = ['010', '011', '012', '013', '014', '015', '016', '017', '018', '019']
    
    prefix = random.choice(prefixes)
    # Generate 7 more digits to make it a 10-digit number
    rest_of_number = ''.join([str(random.randint(0, 9)) for _ in range(7)])
    
    return f"+60{prefix}{rest_of_number}"

def generate_address():
    """Generate a random Malaysian address"""
    
    # Randomly select a state and its district
    state = random.choice(list(STATES_AND_DISTRICTS.keys()))
    city = random.choice(STATES_AND_DISTRICTS[state])
    
    return f"{random.randint(1, 999)} {random.choice(STREET_NAMES)} {random.choice(STREET_TYPES)}, {city}, {state}, {random.randint(10000, 99999)}"

def hash_password(password):
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def generate_profile_picture(first_name, last_name):
    """Generate a profile picture using an avatar API"""
    try:
        # Use UI Avatars API to generate avatar based on name
        # Ref: https://ui-avatars.com/
        full_name = f"{first_name} {last_name}".replace(' ', '+')
        avatar_url = f"https://ui-avatars.com/api/?name={full_name}&background=random&color=random&rounded=true&bold=true"
        
        # Fetch the avatar
        response = requests.get(avatar_url)
        
        if response.status_code == 200:
            # Convert image to base64
            return base64.b64encode(response.content).decode('utf-8')
        
        return None
    
    except Exception as e:
        print(f"Error generating profile picture: {e}")
        return None

def generate_admins(num_admins=50):
    """Generate a list of admin dictionaries"""
    admins = []
    
    # Add the master admin first
    master_admin_id = "ADMIN-MASTER"
    master_admin = {
        '_id': master_admin_id,
        'id': master_admin_id,
        'username': "master_admin",
        'email': "masteradmin@gmail.com",
        'phone_number': "None", 
        'role': "Current Admin", # So this master admin can access the dashboard
        'first_name': "None", 
        'last_name': "None", 
        'address': "None", 
        'password': hash_password('AdminPassword123!'),
        'profile_picture': generate_profile_picture("Master", "Admin"),
        'createdAt': datetime.now(timezone.utc),
        'updatedAt': datetime.now(timezone.utc),
        '__v': 0
    }
    admins.append(master_admin)
    
    # Generate other random admins
    for _ in range(num_admins):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        
        admin_id = "ADMIN-" + str(uuid.uuid4())
        current_time = datetime.now(timezone.utc)
        
        admin = {
            '_id': admin_id,
            'id': admin_id,
            'username': f"{first_name.lower()}_{last_name.lower()}",
            'email': f"{first_name.lower()}.{last_name.lower()}@gmail.com",
            'phone_number': generate_phone_number(),
            'role': random.choice(ADMIN_ROLES),
            'first_name': first_name,
            'last_name': last_name,
            'address': generate_address(),
            'password': hash_password('AdminPassword123!'),  # Default secure password
            'profile_picture': generate_profile_picture(first_name, last_name),
            'createdAt': current_time,
            'updatedAt': current_time,
            '__v': 0
        }
        
        admins.append(admin)
    
    return admins

def populate_admins():
    """Populate the admins collection in MongoDB"""
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[ADMINS_COLLECTION]
        
        # Generate admins
        admins = generate_admins()
        
        # Insert admins
        if admins:
            # Delete existing admins before inserting new ones
            collection.delete_many({})
            
            # Insert new admins
            result = collection.insert_many(admins)
            
            print(f"Successfully inserted {len(result.inserted_ids)} admins")
        
        client.close()
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    populate_admins()