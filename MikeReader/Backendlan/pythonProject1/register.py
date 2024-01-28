from flask import Flask, request, jsonify, abort, g
from flask_cors import CORS
import sqlite3
import os
import hashlib

app = Flask(__name__)
CORS(app)

DATABASE = '/home/mikereader/user/data/user_data.db'
database_directory = os.path.dirname(DATABASE)

if not os.path.exists(database_directory):
    os.makedirs(database_directory)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT NOT NULL,
                            email TEXT NOT NULL,
                            password TEXT NOT NULL
                        )''')
        db.commit()

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
    init_db()  # 初始化数据库
    app.run(debug=True, host='0.0.0.0', port=5000)




