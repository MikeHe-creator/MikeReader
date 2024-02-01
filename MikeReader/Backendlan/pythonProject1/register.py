from flask import Flask, request, jsonify, abort, g
from flask_cors import CORS
import os
import hashlib
import mysql.connector

app = Flask(__name__)
CORS(app)

DATABASE_CONFIG = {
    'host': 'localhost',
    'user': 'root2',
    'password': 'Mysql123',
    'database': 'mydatabase'
}

def create_database():
    try:
        conn = mysql.connector.connect(
            host=DATABASE_CONFIG['host'],
            user=DATABASE_CONFIG['user'],
            password=DATABASE_CONFIG['password']
        )
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS mydatabase")
        conn.commit()
        print("Database 'mydatabase' created successfully")
    except Exception as e:
        print("Error creating database:", e)
    finally:
        cursor.close()
        conn.close()

def create_table():
    try:
        conn = mysql.connector.connect(**DATABASE_CONFIG)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        """)
        conn.commit()
        print("Table 'users' created successfully")
    except Exception as e:
        print("Error creating table:", e)
    finally:
        cursor.close()
        conn.close()

def get_db():
    create_database()  # 创建数据库
    create_table()     # 创建数据表
    conn = getattr(g, '_database', None)
    if conn is None:
        conn = g._database = mysql.connector.connect(**DATABASE_CONFIG)
    return conn

@app.teardown_appcontext
def close_connection(exception):
    conn = getattr(g, '_database', None)
    if conn is not None:
        conn.close()

@app.route('/register', methods=['POST'])
def register_user():
    user_data = request.json

    if not all(key in user_data for key in ['username', 'email', 'password']):
        abort(400, 'Incomplete user data')

    if not all(user_data[key] for key in ['username', 'email', 'password']):
        abort(400, 'Empty username, email, or password')

    hashed_password = hashlib.sha256(user_data['password'].encode()).hexdigest()

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)',
                       (user_data['username'], user_data['email'], hashed_password))
        conn.commit()
        print("Data inserted into database successfully")
    except Exception as e:
        print("Error inserting data into database:", e)
        abort(500, 'Failed to register user')

    response = {'message': 'User registered successfully'}
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)





