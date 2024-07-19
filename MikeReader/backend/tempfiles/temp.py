import zipfile
from ebooklib import epub

epub_path = r"E:\BaiduNetdiskDownload\download\纳尼亚传奇（完美全集）.epub"

try:
    with zipfile.ZipFile(epub_path, 'r') as z:
        file_list = z.namelist()
        print("Files in the EPUB archive:")
        for file_name in file_list:
            print(file_name)

        # 读取EPUB文件中的某个文件内容（例如，某个章节或元数据文件）
        # 这里假设有一个名为 'content.opf' 的文件
        with z.open('content.opf') as file:
            content = file.read()
            print("\nContent of 'content.opf':")
            print(content)

    # 使用 ebooklib 解析文件内容
    book = epub.read_epub(epub_path)
    print('Book read successfully:', book)

except Exception as e:
    print('Error:', e)
