from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s [%(levelname)s] - %(message)s',
                    handlers=[
                        logging.StreamHandler(),  # Log to the console
                    ]
                    )

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Task_Management'

# Create a MongoDB client and database connection
client = MongoClient(app.config['MONGO_URI'])
db = client.get_database()

# Create a collection for user data
users = db['task_management_users']

# In-memory storage for user data (Replace with your database)
# Note: You have two "users" variables, you should remove the in-memory one to avoid conflicts
# users = []

# Route for user registration
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json  # Get JSON data from the request body

    # Log the incoming data
    logging.info(f"Received signup request with data: {data}")

    # Validate the data (you can add more validation here)
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if the email is already registered (Replace this with database query)
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 400

    # Store the user data in MongoDB (Replace this with database insertion)
    users.insert_one(data)

    # Log successful registration
    logging.info("User registration successful")

    return jsonify({"message": "Registration successful"}), 201


# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json  # Get JSON data from the request body

    # Log the incoming login attempt
    logging.info(f"Received login request with data: {data}")

    # Validate the data (you can add more validation here)
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if the email and password match (Replace this with your logic)
    user = users.find_one({"email": data["email"], "password": data["password"]})
    if user:
        # Log successful login
        logging.info("Login successful")
        return jsonify({"message": "Login successful"}), 200

    # Log failed login attempt
    logging.warning("Login failed. Email or password is incorrect.")
    return jsonify({"error": "Login failed. Email or password is incorrect."}), 401


# New route to print user information (for debugging/testing purposes)
@app.route('/print_users', methods=['GET'])
def print_users():
    # Log the request to print user information
    logging.info("Received request to print user information")

    # Iterate through the list of users and print their attributes
    user_info = []
    for user in users.find():
        user_info.append({"email": user['email'], "password": user['password']})

    return jsonify({"users": user_info}), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True)
