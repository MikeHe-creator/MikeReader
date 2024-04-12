import os,string, random
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import fitz  # PyMuPDF
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/sendpdfs', methods=['POST'])
def sendpdfs():
    getpdfs = request.files['book']
    print(getpdfs)
    image_paths = createTEMP(getpdfs)
    return jsonify({'image_paths': image_paths}), 200

def createTEMP(getpdfs):
    letters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(letters) for i in range(10))
    upload_folder = 'temp-'+random_name
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, getpdfs.filename)
    getpdfs.save(filepath)
    return turntoPNG(filepath)

def turntoPNG(filepath):
    doc = fitz.open(filepath)
    numpages = doc.page_count
    print(numpages)
    images = []
    for i in range(numpages):
        page = doc.load_page(i)
        pixmap = page.get_pixmap()
        png = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
        image_name = f"image_{i+1}.png"
        image_path = os.path.join(os.path.dirname(filepath), image_name)
        png.save(image_path, format="PNG")
        images.append(image_path)
    print(images)
    doc.close()
    return images

@app.route('/<folder>/<filename>', methods=['GET'])
def get_temp_file(folder, filename):
    return send_from_directory(os.path.join(app.root_path, folder), filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

