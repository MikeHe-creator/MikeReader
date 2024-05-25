import base64,os,string, random,re
from io import BytesIO
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import fitz  # PyMuPDF
from PIL import Image

app = Flask(__name__)
CORS(app)

canvas_ids = []
foundfile = []
upload_folder=[]

@app.route('/sendpdfs', methods=['POST'])
def sendpdfs():
    global foundfile
    getpdfs = request.files['book']
    print(getpdfs)
    outline, upload_folder, numpages = createTEMP(getpdfs)
    foundfile = getpdfPNG(upload_folder) #新增部分
    return jsonify({'numpages': numpages, 'outline': outline, 'pdftemp':upload_folder}), 200

def createTEMP(getpdfs):
    global upload_folder
    letters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(letters) for i in range(10))
    upload_folder = 'temp-'+random_name
    os.makedirs(upload_folder, exist_ok=True) #创建路径
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

getps = {}
@app.route("/sendP", methods=['GET', 'POST'])
def sendP():
    global getps
    getps=request.json
    print(getps)
    addtext(getps,upload_folder)
    return jsonify({"message": "Data received successfully", "data":getps})

@app.route("/sendCanvas", methods=['GET', 'POST'])
def sendCanvas():
    global canvas_ids
    getcanvas=request.json
    combinePNG(foundfile, getcanvas,upload_folder)
    return jsonify({"message": "Data received successfully", "data":getcanvas})

def getpdfPNG(upload_folder):
    foundfile0=[]
    print('Combining PNG',upload_folder)
    files = os.listdir(upload_folder)
    for file_name in files:
        foundfile0.append(file_name)
    foundfile=foundfile0[1:]
    print('Found file:', foundfile)
    return foundfile

def combinePNG(foundfile, getcanvas, upload_folder):
    data_list = getcanvas.get('data', [])
    canvas_ids = [item['id'] for item in data_list]
    print('canvas_ids',canvas_ids)
    print(getcanvas)
    canvas_data = {item['id']: item['dataURL'] for item in data_list}
    for f1 in foundfile:
        imgnum = re.search(r'_(\d+)', f1)
        if imgnum:
            canvasID = 'canvas' + imgnum.group(1)
            if canvasID in canvas_ids:
                print(f"Found matching canvas ID: {canvasID}")
                # 读取现有图片
                existing_image_path = os.path.join(upload_folder, f1)
                existing_image = Image.open(existing_image_path)

                canvas_data_url = canvas_data[canvasID]
                canvas_base64_str = canvas_data_url.split(',')[1]
                canvas_image_data = base64.b64decode(canvas_base64_str)
                canvas_image = Image.open(BytesIO(canvas_image_data))

                combined_image = Image.new('RGBA', existing_image.size)
                combined_image.paste(existing_image, (0, 0))
                combined_image.paste(canvas_image, (0, 0), canvas_image)

                base_name = os.path.splitext(f1)[0]
                preview_image_name = f"combined_{base_name}.png"
                combined_image_path = os.path.join(upload_folder, preview_image_name)
                combined_image.save(combined_image_path)

                print(f"Saved combined image at: {combined_image_path}")
                combined_image.show()
            else:
                base_name = os.path.splitext(f1)[0]
                preview_image_name = f"combined_{base_name}.png"
                new_file_path = os.path.join(upload_folder, preview_image_name)
                os.rename(os.path.join(upload_folder, f1), new_file_path)
        else:
            print(f"No match found in filename: {f1}")

def addtext(getps,upload_folder):
    print('addtext',getps)
    data_list = getps.get('data', [])
    for item in data_list:
        textmessage = item.get('text')
        style = item.get('style', {})
        textX = style.get('left')
        textY = style.get('top')
        textColor=style.get('color')
        textStyle = style.get('fontStyle')
        textSize = style.get('fontSize')
        class_str = item.get('class', '')
        match = re.search(r'canvas(\d+)', class_str)
        canvas_number = match.group(1) if match else None
        wanttofind="combined_image_"+canvas_number+".png"
        files = os.listdir(upload_folder)
        if wanttofind in files:
            wanttofind.insert_text((textX, textY), textmessage, fontsize=textSize, color=textColor, fontname="../pages/Elements/font/MiSans-Light.ttf")
            wanttofind.show()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

