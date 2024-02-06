from flask import Flask, request, jsonify, abort, g
from flask_cors import CORS
import hashlib, smtplib, secrets
import mysql.connector
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

DATABASE_CONFIG = {
    'host': 'localhost',
    'user': 'root2',
    'password': 'Mysql123',
    'database': 'mydatabase'
}

# 全局变量用于存储验证码
verification_code = None

# 生成验证码的函数
def generate_verification_code():
    return ''.join(secrets.choice('0123456789') for _ in range(6))

@app.route('/send_verification_code', methods=['POST'])
def send_verification_code():
    global verification_code  # 引入全局变量
    email_data = request.json

    if 'email' not in email_data or not email_data['email']:
        abort(400, 'Invalid email')

    if verification_code is None:
        # 如果验证码尚未生成，则生成新的验证码
        verification_code = generate_verification_code()

        # 发送邮件
        sender_email = 'mikereader.register.en01@mikelearner.com'  # 发送邮件的邮箱地址
        sender_password = 'oUStIm,55,='  # 发送邮件的邮箱密码
        receiver_email = email_data['email']

        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = receiver_email
        message['Subject'] = 'Verification Code'

        # 使用存储的验证码
        body = f'Your verification code is: {verification_code}'
        print("发给用户邮箱里的vccode: ", body)
        message.attach(MIMEText(body, 'plain'))

        try:
            server = smtplib.SMTP('vmi1621588.contaboserver.net', 587)  # 修改为你的邮箱的 SMTP 服务器和端口号
            server.starttls()
            server.login(sender_email, sender_password)
            text = message.as_string()
            server.sendmail(sender_email, receiver_email, text)
            server.quit()
            print("Verification code sent successfully")

            # 向客户返回存储的验证码
            print("返还给前端的vccode: ", verification_code)
            return jsonify({'code': verification_code}), 200
        except Exception as e:
            print("Error sending verification code:", e)
            abort(500, 'Failed to send verification code')

    # 如果验证码已经生成，直接返回存储的验证码
    print("返还给前端的vccode: ", verification_code)
    return jsonify({'code': verification_code}), 200

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

