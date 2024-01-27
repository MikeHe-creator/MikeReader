from flask import Flask, request, jsonify, abort, g
from flask_cors import CORS
import sqlite3
import hashlib

app = Flask(__name__)
CORS(app)

DATABASE = '/home/mikereader/user/data/user_data.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/register', methods=['POST'])
def register_user():
    user_data = request.json

    if not all(key in user_data for key in ['username', 'email', 'password']):
        abort(400, 'Incomplete user data')

    if not all(user_data[key] for key in ['username', 'email', 'password']):
        abort(400, 'Empty username, email, or password')

    hashed_password = hashlib.sha256(user_data['password'].encode()).hexdigest()

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                       (user_data['username'], user_data['email'], hashed_password))
        db.commit()
        print("Data inserted into database successfully")
    except Exception as e:
        print("Error inserting data into database:", e)
        abort(500, 'Failed to register user')

    response = {'message': 'User registered successfully'}
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)


