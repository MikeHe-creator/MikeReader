import zipfile,os

epub_path = "E:\BaiduNetdiskDownload\download\纳尼亚传奇（完美全集）.epub"
#epub_path = "E:\BaiduNetdiskDownload\pg57787.epub"

def extract_opf_from_epub(epub_path):
    with zipfile.ZipFile(epub_path, 'r') as z:
        # 查找 OPF 文件
        opf_file = [f for f in z.namelist() if f.endswith('.opf')][0]
        with z.open(opf_file) as f:
            opf_content = f.read()
    return opf_content

opf_content = extract_opf_from_epub(epub_path)
print(opf_content.decode('utf-8'))