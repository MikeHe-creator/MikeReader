import fitz,os
from flask_cors import CORS
from flask import Flask,jsonify,request

app = Flask(__name__)
CORS(app)

@app.route('/sendpdfs',methods=['POST'])
def get_PDF():
    if 'book' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    pdffile = request.files['book']
    print("the result of pdffile:",pdffile)
    if pdffile.filename is None:
        return jsonify({'error': 'No selected file'}), 400

    upload_folder = 'temp'
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, pdffile.filename)
    pdffile.save(filepath)

    outline = get_PDFoutline(filepath)
    os.remove(filepath)
    os.removedirs("temp")
    return jsonify({'outline': outline}), 200

def get_PDFoutline(filepath):
    doc = fitz.open(filepath)
    outline = doc.get_toc()
    doc.close()
    print("the result of outline", outline)
    return outline

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)