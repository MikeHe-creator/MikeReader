import base64, os, string, random,ebooklib
import zipfile
from ebooklib import epub
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/tempfiles/<path:filename>')
def serve_file(filename):
    return send_from_directory('tempfiles', filename)

@app.route('/sendepub', methods=['POST'])
def sendepub():
    getepub = request.files['book']
    bookmenu, upload_folder, content_files, css_files, image_files = createPath(getepub)
    content_files = [f"/tempfiles/{os.path.relpath(file, 'tempfiles')}" for file in content_files]
    print('content_files', content_files)
    css_files = [f"/tempfiles/{os.path.relpath(file, 'tempfiles')}" for file in css_files]
    image_files = [f"/tempfiles/{os.path.relpath(file, 'tempfiles')}" for file in image_files]
    print('image_files', image_files)
    return jsonify({
        'bookmenu': bookmenu,
        'tempfloder': upload_folder,
        'contentfiles': content_files,
        'contentcss': css_files,
        'contentimg': image_files
    }), 200

def createPath(getepub):
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'tempfiles'))
    letters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(letters) for i in range(10))
    upload_folder = os.path.join(base_path, 'temp-' + random_name)
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, getepub.filename)
    getepub.save(filepath)
    try:
        book = epub.read_epub(filepath)
        print(book)
        bookmenu = refermenu(book)

    except Exception as e:
        bookmenu=zipmenu()
    content_files, css_files, image_files = refercontent(filepath,upload_folder)
    return upload_folder,bookmenu,content_files,css_files,image_files

def zipmenu():
    pass

def refermenu(book):
    bookmenu = []
    toc = book.toc
    for content in toc:
        if isinstance(content, epub.Link):
            text = content.title
            bookmenu.append(text)
        elif isinstance(content, tuple) and isinstance(content[0], epub.Section):
            section = content[0]
            section_title = section.title
            sectionmenu = {'section': section_title}
            section_links = []
            for link_item in content[1]:
                if isinstance(link_item, epub.Link):
                    link_title = link_item.title
                    section_links.append({'link': link_title})
            sectionmenu['links'] = section_links
            bookmenu.append(sectionmenu)
        else:
            print('Unknown type:', type(content))
    return bookmenu

def refercontent(filepath, upload_folder):
    content_files = []
    css_files = []
    image_files = []

    html_dir = os.path.join(upload_folder, 'html')
    css_dir = os.path.join(upload_folder, 'css')
    images_dir = os.path.join(upload_folder, 'images')

    os.makedirs(html_dir, exist_ok=True)
    os.makedirs(css_dir, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)

    with zipfile.ZipFile(filepath, 'r') as z:
        for file_name in z.namelist():
            if file_name.endswith('/'):
                continue
            if file_name.endswith(('.html','.xhtml')):
                target_path = os.path.join(html_dir, os.path.basename(file_name))
                content_files.append(target_path)
            elif file_name.endswith('.css'):
                target_path = os.path.join(css_dir, os.path.basename(file_name))
                css_files.append(target_path)
            elif file_name.endswith(('.jpg', '.png', '.jpeg', '.gif')):
                target_path = os.path.join(images_dir, os.path.basename(file_name))
                image_files.append(target_path)
            else:
                continue

            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            with z.open(file_name) as source_file:
                with open(target_path, 'wb') as target_file:
                    target_file.write(source_file.read())

    return content_files, css_files, image_files


if __name__ == '__main__':
    app.run(debug=True, port=5000)
