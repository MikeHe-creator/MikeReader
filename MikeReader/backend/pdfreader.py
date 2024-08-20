import os,string, random,re,io,base64,shutil
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import fitz  # PyMuPDF
from PIL import Image

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = os.path.abspath(os.path.join(os.path.dirname(__file__), 'tempfiles'))

@app.route('/files/<path:filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/sendpdfs', methods=['POST'])
def sendpdfs():
    getpdfs = request.files['book']
    outline, upload_folder, numpages = createTEMP(getpdfs)
    # 确保路径相对于UPLOAD_FOLDER是正确的
    numpages = [os.path.relpath(page, app.config['UPLOAD_FOLDER']) for page in numpages]
    return jsonify({'numpages': numpages, 'outline': outline, 'pdftemp': upload_folder}), 200

upload_folder = ''
def createTEMP(getpdfs):
    global upload_folder
    base_path = app.config['UPLOAD_FOLDER']
    letters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(letters) for i in range(10))
    upload_folder = os.path.join(base_path, 'temp.html-' + random_name)
    os.makedirs(upload_folder, exist_ok=True) #创建路径
    filepath = os.path.join(upload_folder, getpdfs.filename)
    getpdfs.save(filepath)
    numpages, outline = turntoPNG(filepath)
    return outline, upload_folder, numpages

def turntoPNG(filepath):
    import fitz
    from PIL import Image

    doc = fitz.open(filepath)
    outline = doc.get_toc()
    numpages = doc.page_count
    images = []
    for i in range(numpages):
        page = doc.load_page(i)
        pixmap = page.get_pixmap()
        png = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
        image_name = f"image_{i + 1}.png"
        image_path = os.path.join(os.path.dirname(filepath), image_name)
        png.save(image_path, format="PNG")
        images.append(image_path)
    doc.close()
    return images, outline

#另存为
@app.route("/sendnotes", methods=['GET', 'POST'])
def sendnotes():
    getnotes=request.json
    print(getnotes)
    save_path=combineNotes(getnotes)
    print('sendnotes_savepath',save_path)
    return {'message': 'saved successfully','savepath':save_path}, 200

def combineNotes(getnotes):
    #整合图像
    doc = fitz.open(upload_folder + '/blob')
    for text_data in getnotes['data']['datacanvas']:
        imageNum = text_data['id'][6:]
        page = doc.load_page(int(imageNum)-1)
        page_width = page.rect.width
        page_height = page.rect.height
        image_data = text_data['dataURL'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        rect = fitz.Rect(0, 0, page_width, page_height)
        image_stream = io.BytesIO(image_bytes)
        pix = fitz.Pixmap(image_stream)
        page.insert_image(rect, pixmap=pix)

    #整合文本
    for text_data in getnotes['data']['dataps']:
        pclass=text_data['class']
        match = re.search(r'canvas(\d+)', pclass)
        pnumber = match.group(1) if match else None
        page = doc.load_page(int(pnumber)-1)
        style = text_data['style']
        text = text_data['text']
        top = float(re.sub('px$', '', style['top']))
        left = float(re.sub('px$', '', style['left']))
        font_size = float(re.sub('px$', '', style['fontSize']))
        color_match = re.match(r'rgb\((\d+), (\d+), (\d+)\)', style['color'])
        color = (0, 0, 0)
        if color_match:
            color = tuple(map(int, color_match.groups()))
            color = tuple(c / 255 for c in color)
        font_style = style['fontStyle']
        if font_style=='normal':
            font = '../pages/Elements/font/Misans/MiSans-Normal.ttf'
            page.insert_font(fontname='F0',fontfile=font)
        elif font_style=='italic':
            font = '../pages/Elements/font/Misans/MiSans-Italic.ttf'
            page.insert_font(fontname='F0',fontfile=font)
        print('(left,top)',left,top)
        page.insert_text((left-400, top-(int(pnumber)-1)*page_height), text, fontsize=font_size, fontname='F0', color=color)
    return pdfsave(doc)

def pdfsave(doc):
    save_path = os.path.join(upload_folder, 'temp.html-finished.pdf')
    doc.save(save_path)
    doc.close()
    return save_path

#删除文件
@app.route('/delete-temp-folder', methods=['POST'])
def delete_temp_folder():
    user_left=request.json
    print(user_left)
    if user_left:
        temp_folder_path = upload_folder
        print('temp_folder_path',temp_folder_path)
        try:
            if os.path.exists(temp_folder_path):
                shutil.rmtree(temp_folder_path)
                return 'Temp folder deleted', 200
            else:
                return 'Temp folder not found', 404
        except Exception as e:
            return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

