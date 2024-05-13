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
    outline, upload_folder, numpages = createTEMP(getpdfs)
    return jsonify({'numpages': numpages, 'outline': outline, 'pdftemp':upload_folder}), 200

def createTEMP(getpdfs):
    letters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(letters) for i in range(10))
    upload_folder = 'temp-'+random_name
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, getpdfs.filename)
    getpdfs.save(filepath)
    numpages, outline = turntoPNG(filepath)
    return outline, upload_folder, numpages

def turntoPNG(filepath):
    doc = fitz.open(filepath)
    outline = doc.get_toc()
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
    print("outline",outline)
    doc.close()
    return images, outline

if __name__ == '__main__':
    app.run(debug=True, port=5000)

