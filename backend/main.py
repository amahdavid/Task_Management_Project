from functools import wraps

from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required, JWTManager, get_jwt_identity, create_access_token
from pymongo import MongoClient, ReturnDocument
import logging
#from datetime import datetime, timedelta

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

app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to your secret key
jwt = JWTManager(app)


@app.route('/protected_route', methods=['GET'])
@jwt_required
def protected_route(user_email):
    current_user = get_jwt_identity()
    return jsonify(message=f'This route is protected! Welcome, {current_user}.')


# Route for user registration
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json  # Get JSON data from the request body

        # Log the incoming data
        logging.info(f"Received signup request with data: {data}")

        # Validate the data (you can add more validation here)
        if 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email and password are required"}), 400

        # Check if the email is already registered (Replace this with a database query)
        if users.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already exists"}), 400

        users.insert_one(data)

        # Log successful registration
        user_email = data['email']
        access_token = create_access_token(identity=user_email)
        logging.info("User registration successful")

        return jsonify({"message": "Registration successful", "access_token": access_token}), 201

    except Exception as e:
        # Handle any exceptions that occur during signup
        logging.error(f"Error during signup: {str(e)}")
        return jsonify({"error": "An error occurred during signup"}), 500


# Route for user login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json  # Get JSON data from the request body

        # Log the incoming login attempt
        logging.info(f"Received login request with data: {data}")

        # Validate the data (you can add more validation here)
        if 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email and password are required"}), 400

        # Check if the email and password match
        user = users.find_one({"email": data["email"], "password": data["password"]})
        if user:
            user_email = user['email']
            access_token = create_access_token(identity=user_email)
            return jsonify({'message': 'Login successful', 'access_token': access_token}), 200

        # Log failed login attempt
        logging.warning("Login failed. Email or password is incorrect.")
        return jsonify({"error": "Login failed. Email or password is incorrect."}), 401
    except Exception as e:
        # Handle any exceptions that occur during login
        logging.error(f"Error during login: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500


# Route for creating a new board
@app.route('/create_board', methods=['POST'])
def create_board():
    try:
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
            "columns": []
        }

        # Insert the new board document into the database
        board_id = boards.insert_one(board_data).inserted_id

        # Log successful board creation
        logging.info(f"Board created with ID: {board_id}")
        return jsonify({"message": "Board created successfully", "board_id": str(board_id)}), 201
    except Exception as e:
        # Handle any exceptions that occur during board creation
        logging.error(f"Error during board creation: {str(e)}")
        return jsonify({"error": "An error occurred during board creation"}), 500


# Add a route to fetch boards associated with a user
@app.route('/get_boards/<userEmail>', methods=['GET'])
def get_boards(userEmail):
    try:
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
    except Exception as e:
        # Handle any exceptions that occur during board retrieval
        logging.error(f"Error during board retrieval: {str(e)}")
        return jsonify({"error": "An error occurred during board retrieval"}), 500


# Route for getting a specific board
@app.route('/get_board/<userEmail>/<boardId>', methods=['GET'])
def get_board(userEmail, boardId):
    try:
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
    except Exception as e:
        # Handle any exceptions that occur during board retrieval
        logging.error(f"Error during board retrieval: {str(e)}")
        return jsonify({"error": "An error occurred during board retrieval"}), 500


# Route for updating a board
@app.route('/update_board/<board_id>', methods=['PUT'])
def update_board(board_id):
    try:
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
    except Exception as e:
        # Handle any exceptions that occur during board update
        logging.error(f"Error during board update: {str(e)}")
        return jsonify({"error": "An error occurred during board update"}), 500


# Route for deleting a board
@app.route('/delete_board/<board_id>', methods=['DELETE'])
def delete_board(board_id):
    try:
        # Log the request to delete a board
        logging.info(f"Received request to delete board with ID: {board_id}")

        # Delete the board from the database based on the provided board_id
        result = boards.delete_one({"_id": ObjectId(board_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Board not found"}), 404

        # Log successful board deletion
        logging.info(f"Board with ID {board_id} deleted")

        return jsonify({"message": "Board deleted successfully"}), 200
    except Exception as e:
        # Handle any exceptions that occur during board deletion
        logging.error(f"Error during board deletion: {str(e)}")
        return jsonify({"error": "An error occurred during board deletion"}), 500


# Route for creating a new column
@app.route('/create_column/<board_id>', methods=['POST'])
def create_column(board_id):
    try:
        data = request.json

        # Log the incoming data
        logging.info(f"Received create column request with data: {data}")

        # Validate the data (you can add more validation here)
        if 'columnName' not in data:
            return jsonify({"error": "Column name is required"}), 400

        # Create a new column document and associate it with the board
        column_data = {
            "column_name": data["columnName"],
            "tasks": []
        }

        new_column_id = ObjectId()
        result = boards.find_one_and_update(
            {"_id": ObjectId(board_id)},
            {"$push": {"columns": {"_id": new_column_id, **column_data}}}
        )

        if not result:
            return jsonify({"error": "Board not found"}), 404

        # Log successful column creation
        logging.info(f"Column created with name: {data['columnName']}")
        return jsonify({"message": "Column created successfully", "column_id": str(new_column_id)}), 201

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


# Route for creating a new task
@app.route('/create_task/<board_id>/<column_id>', methods=['POST'])
def create_task(board_id, column_id):
    try:
        data = request.json

        # Log the incoming data
        logging.info(f"Received create task request with data: {data}")

        # Validate the data (you can add more validation here)
        if 'taskTitle' not in data:
            return jsonify({"error": "Task name is required"}), 400

        # Create a new task document and associate it with the column
        task_data = {
            "task_name": data["taskTitle"]
        }

        new_task_id = ObjectId()
        result = boards.find_one_and_update(
            {"_id": ObjectId(board_id), "columns._id": ObjectId(column_id)},
            {"$push": {"columns.$.tasks": {"_id": new_task_id, **task_data}}}
        )

        if not result:
            return jsonify({"error": "Column not found to add task to"}), 404

        # Log successful task creation
        logging.info(f"Task created with name: {data['taskTitle']}")

        response_data = {
            "message": "Task created successfully",
            "task_id": str(new_task_id),
            "task_name": data["taskTitle"],
            "column_id": column_id
        }

        return jsonify(response_data), 201

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/update_task/<board_id>/<column_id>/<task_id>', methods=['PUT'])
def update_task(board_id, column_id, task_id):
    try:
        data = request.json

        # Log the incoming data
        logging.info(f"Received update task request with data: {data}")

        if 'task_name' not in data:
            return jsonify({"error": "Task title is required"}), 400

        # Convert task_id string to ObjectId
        task_id_obj = ObjectId(task_id)

        # Validate and update the task data in the database
        updated_task = boards.find_one_and_update(
            {"_id": ObjectId(board_id), "columns._id": ObjectId(column_id), "columns.tasks._id": ObjectId(task_id)},
            {"$set": {"columns.$[column].tasks.$[task].task_name": data["task_name"]}},
            array_filters=[{"column._id": ObjectId(column_id)}, {"task._id": ObjectId(task_id)}],
        )

        if not updated_task:
            return jsonify({"error": "Task not found"}), 404

        # Log successful task update
        logging.info(f"Task with ID {task_id} updated")

        response_data = {
            "message": "Task updated successfully",
            "task_id": str(task_id_obj),
            "task_name": data["task_name"],
        }

        return jsonify(response_data), 200
    except Exception as e:
        logging.error(f"An error occurred while updating the task: {str(e)}")
        return jsonify({"error": "Internal server error"}, 500)


# Route for fetching columns with associated tasks
@app.route('/get_columns/<board_id>', methods=['GET'])
def get_columns(board_id):
    try:
        # Convert the board_id string to ObjectId
        board_id_obj = ObjectId(board_id)

        # Find the board document by its ObjectId
        board = boards.find_one({"_id": board_id_obj})

        if not board:
            return jsonify({"error": "Board not found"}), 404

        # Get the columns data from the board document
        columns = board.get("columns", [])

        # Convert ObjectId to string and retrieve tasks for each column
        columns_with_tasks = []
        for column in columns:
            column_id = str(column['_id'])
            column_name = column['column_name']
            tasks = column.get("tasks", [])

            # Convert ObjectId to string for each task
            tasks = [{'_id': str(task['_id']), 'task_name': task['task_name']} for task in tasks]

            columns_with_tasks.append({'_id': column_id, 'column_name': column_name, 'tasks': tasks})

        # Extract just the column names from the columns
        column_names = [column['column_name'] for column in columns]

        # Create a response with the columns data and names
        response_data = {"columns": columns_with_tasks, "column_names": column_names}
        return jsonify(response_data), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


# Route for fetching tasks
@app.route('/get_tasks/<board_id>/<column_id>', methods=['GET'])
def get_tasks(board_id, column_id):
    try:
        # Convert the board_id and column_id strings to ObjectId
        board_id_obj = ObjectId(board_id)
        column_id_obj = ObjectId(column_id)

        # Find the board document by its ObjectId
        board = boards.find_one({"_id": board_id_obj})

        if not board:
            return jsonify({"error": "Board not found"}), 404

        # Get the columns data from the board document
        columns = board.get("columns", [])

        # Find the column with the given column_id
        column = next((column for column in columns if column["_id"] == column_id_obj), None)

        if not column:
            return jsonify({"error": "Column not found"}), 404

        # Get the tasks data from the column
        tasks = column.get("tasks", [])

        # Extract just the task names from the tasks
        task_names = [task["task_name"] for task in tasks]

        # Convert ObjectId to string
        tasks = [{'_id': str(task['_id']), 'task_name': task['task_name']} for task in tasks]

        # Create a response with the tasks data and names
        response_data = {"tasks": tasks, "task_names": task_names}
        return jsonify(response_data), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


# Route for fetching both columns and tasks for a board
@app.route('/get_columns_and_tasks/<board_id>', methods=['GET'])
def get_columns_and_tasks(board_id):
    try:
        # Convert the board_id string to ObjectId
        board_id_obj = ObjectId(board_id)

        # Find the board document by its ObjectId
        board = boards.find_one({"_id": board_id_obj})

        if not board:
            return jsonify({"error": "Board not found"}), 404

        # Get the columns data from the board document
        columns = board.get("columns", [])

        # Extract just the column names from the columns
        column_names = [column["column_name"] for column in columns]

        # Convert ObjectId to string for columns
        columns = [{'_id': str(column['_id']), 'column_name': column['column_name']} for column in columns]

        # Fetch tasks for each column
        for column in columns:
            column_id = column['_id']
            column_tasks = board.get("tasks", [])

            # Extract just the task names from the tasks
            task_names = [task["task_name"] for task in column_tasks]

            # Convert ObjectId to string for tasks
            column_tasks = [{'_id': str(task['_id']), 'task_name': task['task_name']} for task in column_tasks]

            column["tasks"] = column_tasks
            column["task_names"] = task_names

        # Create a response with the combined data
        response_data = {"columns": columns, "column_names": column_names}
        return jsonify(response_data), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/update_task_position/<board_id>/<column_id>/<task_id>', methods=['PUT'])
def update_task_position(board_id, column_id, task_id):
    try:
        data = request.json

        # Log the incoming data
        logging.info(f"Received update task position request with data: {data}")

        # Validate and extract the necessary data
        if 'newColumnId' not in data or 'newPosition' not in data:
            return jsonify({"error": "New column ID and position are required"}), 400

        new_column_id = data["newColumnId"]
        new_position = data["newPosition"]

        # Fetch the board based on board_id
        board = boards.find_one({"_id": ObjectId(board_id)})

        if not board:
            return jsonify({"error": "Board not found"}), 404

        # Find and update the task's position within the specified column
        task_to_move = None
        source_column = None
        for column in board.get("columns", []):
            for task in column.get("tasks", []):
                if str(task["_id"]) == task_id:
                    task_to_move = task
                    source_column = column
                    break

            if task_to_move:
                break

        if task_to_move is None:
            return jsonify({"error": "Task not found in the board or column"}), 404

        # remove the task from the source column
        source_column["tasks"].remove(task_to_move)

        # find the destination column and position
        destination_column_id = new_column_id
        destination_position = new_position

        # insert the task into the destination column
        destination_column = next((column for column in board.get("columns", [])
                                   if str(column["_id"]) == destination_column_id), None)
        if destination_column:
            destination_column["tasks"].insert(destination_position, task_to_move)

        # Update the board in the database
        result = boards.find_one_and_update(
            {"_id": ObjectId(board_id)},
            {"$set": {"columns": board["columns"]}}
        )

        if result is None:
            return jsonify({"error": "Failed to update task position"}), 500

        # Log successful task position update
        logging.info(f"Task position updated successfully in board with ID {board_id}")

        return jsonify({"message": "Task position updated successfully"}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
