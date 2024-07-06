import base64
import os,string,random,ebooklib
from lxml import etree
from ebooklib import epub
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/sendepub', methods=['POST'])
def sendepub():
    getepub = request.files['book']
    upload_folder, bookinfo, bookmenu, contentutf8, css,images = createPath(getepub)
    print('css', css)
    return {'message': 'Serving Flask app pdfreader', 'bookinfo': bookinfo, 'bookmenu': bookmenu, 'bookcontent': contentutf8, 'css': css,'images':images}, 200

def createPath(getepub):
    letters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(letters) for i in range(10))
    upload_folder = 'temp-' + random_name
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, getepub.filename)
    getepub.save(filepath)
    bookinfo, bookmenu, contentutf8, css, images = epubinfom(filepath)
    return upload_folder, bookinfo, bookmenu, contentutf8, css,images

def epubinfom(filepath):
    book = epub.read_epub(filepath)
    title = book.get_metadata('DC', 'title')[0][0]
    author = book.get_metadata('DC', 'creator')[0][0]
    language = book.get_metadata('DC', 'language')[0][0]
    bookinfo = {'title': title, 'author': author, 'language': language}
    toc = book.toc
    bookmenu = parse_toc(toc)
    contentutf8, css,images = readepub(book)
    return bookinfo, bookmenu, contentutf8, css,images

def parse_toc(toc):
    bookmenu = []
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

def readepub(book):
    contentutf8 = []
    css = ''
    images = []

    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = etree.fromstring(item.get_content())
            html_content = etree.tostring(soup, pretty_print=True, encoding='unicode')
            contentutf8.append({'html': html_content})
        elif item.get_type() == ebooklib.ITEM_STYLE:
            css += item.get_content().decode('utf-8')
        elif item.get_type() == ebooklib.ITEM_IMAGE:
            img_content = item.get_content()
            img_base64 = base64.b64encode(img_content).decode('utf-8')
            images.append({'file_name': item.get_name(), 'data': img_base64})
    return contentutf8, css, images

if __name__ == '__main__':
    app.run(debug=True, port=5000)