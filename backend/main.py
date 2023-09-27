from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, ReturnDocument
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
boards = db['task_management_boards']


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


# Route for creating a new board
@app.route('/create_board', methods=['POST'])
def create_board():
    data = request.json  # Get JSON data from the request body

    # log the incoming data
    logging.info(f"Received create board request with data: {data}")

    # Validate the data (you can add more validation here)
    if 'boardName' not in data or 'userEmail' not in data:
        return jsonify({"error": "User ID and board name are required"}), 400

    # Create a new board document and associate it with the user
    board_data = {
        "board_name": data["boardName"],
        "user_id": data["userEmail"],
        "columns": {
            "todo": [],
            "inProgress": [],
            "done": []
        }
    }

    # Insert the new board document into the database
    board_id = boards.insert_one(board_data).inserted_id

    # Log successful board creation
    logging.info(f"Board created with ID: {board_id}")
    logging.info(f"Board data: {board_data}")

    return jsonify({"message": "Board created successfully", "board_id": str(board_id)}), 201


# Add a route to fetch boards associated with a user
@app.route('/get_boards/<userEmail>', methods=['GET'])
def get_boards(userEmail):
    # Log the request to get boards
    logging.info(f"Received request to get boards for user with email: {userEmail}")

    # Get all boards associated with the user
    user_boards = boards.find({"user_id": userEmail})

    # Extract relevant information from each board document
    boards_data = [
        {
            "board_id": str(board["_id"]),
            "board_name": board["board_name"],
            # Add other board properties as needed
        }
        for board in user_boards
    ]

    return jsonify({"boards": boards_data}), 200


@app.route('/get_board/<userEmail>/<boardId>', methods=['GET'])
def get_board(userEmail, boardId):
    # Log the request to get a specific board
    logging.info(f"Received request to get board with ID {boardId} for user with email: {userEmail}")

    # Fetch the specific board associated with the user and the given board_id
    board = boards.find_one({"user_id": userEmail, "_id": ObjectId(boardId)})

    if board is None:
        # Handle the case where the board doesn't exist or isn't associated with the user
        return jsonify({"message": "Board not found"}), 404

    # Extract relevant information from the board document
    board_data = {
        "board_id": str(board["_id"]),
        "board_name": board["board_name"],
        # Add other board properties as needed
    }

    return jsonify({"board": board_data}), 200


# Route for updating a board
@app.route('/update_board/<board_id>', methods=['PUT'])
def update_board(board_id):
    data = request.json  # Get JSON data from the request body

    # Log the incoming data
    logging.info(f"Received update board request for board with ID {board_id} with data: {data}")

    # Validate and update the board data in the database
    updated_board = boards.find_one_and_update(
        {"_id": ObjectId(board_id)},
        {"$set": {"board_name": data["board_name"], "columns": data["columns"]}},
        return_document=ReturnDocument.AFTER
    )

    if not updated_board:
        return jsonify({"error": "Board not found"}), 404

    # Log successful board update
    logging.info(f"Board with ID {board_id} updated")

    return jsonify({"message": "Board updated successfully", "board": updated_board}), 200


# Route for deleting a board
@app.route('/delete_board/<board_id>', methods=['DELETE'])
def delete_board(board_id):
    # Log the request to delete a board
    logging.info(f"Received request to delete board with ID: {board_id}")

    # Delete the board from the database based on the provided board_id
    result = boards.delete_one({"_id": ObjectId(board_id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Board not found"}), 404

    # Log successful board deletion
    logging.info(f"Board with ID {board_id} deleted")

    return jsonify({"message": "Board deleted successfully"}), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True)
