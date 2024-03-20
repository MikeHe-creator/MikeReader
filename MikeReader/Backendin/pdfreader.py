import fitz, os, tempfile, base64
from flask_cors import CORS
from flask import Flask, jsonify, request
from PIL import Image

app = Flask(__name__)
CORS(app)


@app.route('/sendpdfs', methods=['POST'])
def get_PDF():
    if 'book' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    pdffile = request.files['book']
    print("the result of pdffile:", pdffile)
    if pdffile.filename is None:
        return jsonify({'error': 'No selected file'}), 400

    upload_folder = 'temp'
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, pdffile.filename)
    pdffile.save(filepath)

    outline, images = get_PDFoutline(filepath)
    os.remove(filepath)
    os.removedirs("temp")
    print("img张数：", len(images))
    return jsonify({'outline': outline, 'viewpdf': images}), 200


def get_PDFoutline(filepath):
    doc = fitz.open(filepath)
    outline = doc.get_toc()

    numpages = doc.page_count
    images = []
    for num in range(numpages):
        page = doc.load_page(num)
        pixmap = page.get_pixmap()
        img = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
            img.save(temp_file.name, format="PNG")
            with open(temp_file.name, "rb") as image_file:
                image_data = image_file.read()
                image_base64 = base64.b64encode(image_data).decode('utf-8')
                images.append(image_base64)
    doc.close()
    print("the result of outline", outline)
    return outline, images

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
