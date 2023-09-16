from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# In-memory storage for user data (Replace with your database)
users = []


# Route for user registration
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json  # Get JSON data from the request body

    # Validate the data (you can add more validation here)
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if the email is already registered (Replace this with database query)
    if any(user['email'] == data['email'] for user in users):
        return jsonify({"error": "Email already exists"}), 400

    # Store the user data (Replace this with database insertion)
    users.append(data)

    return jsonify({"message": "Registration successful"}), 201


if __name__ == '__main__':
    app.run(port=5000, debug=True)
