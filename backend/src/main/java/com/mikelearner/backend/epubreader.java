package com.mikelearner.backend;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.http.HttpServletRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@RestController("epubreader")
public class epubreader {

    @PostMapping("/epubzip")
    public Map<String, Object> epubzip(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        String jsonFilePath;

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            originalFilename = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
        }
        assert originalFilename != null;
        String sanitizedFilename = originalFilename.replaceAll("[\\p{P}\\s~～]+", "_");

        // 创建临时目录，目录名基于 sanitizedFilename
        File tempDir = new File("Readeruser/epub/temp-" + sanitizedFilename);
        if (!tempDir.exists()) {
            tempDir.mkdirs();
        }

        File jsonFile = new File(tempDir, "data.json");
        if (jsonFile.exists()) {
            // 如果 JSON 文件已存在，直接返回相对路径
            jsonFilePath = "/Readeruser/epub/temp-" + sanitizedFilename + "/data.json";
            response.put("jsonPath", jsonFilePath);
            return response;
        }

        try {
            // 解压 EPUB 文件并收集路径
            Map<String, List<String>> filePaths = unzipEpub(file.getInputStream(), tempDir);

            // 获取 container.xml 文件并提取 OPF 文件路径
            File containerFile = new File(tempDir, "META-INF/container.xml");
            String opfFilePath = extractOpfPath(containerFile);
            System.out.println("container.xml路径为："+opfFilePath);
            if (opfFilePath == null) {
                throw new Exception("OPF file not found in container.xml.");
            }

            // 使用 epublib 读取 OPF 文件获取大纲信息
            List<Map<String, Object>> tocList;
            File opfFile = new File(tempDir, opfFilePath);
            tocList = loadBookFromOpf(opfFile);

            // 将文件路径保存为 JSON 数据
            jsonFilePath = "/Readeruser/epub/temp-" + sanitizedFilename + "/data.json";
            jsonFile = new File(tempDir, "data.json");

            // 使用 Jackson 将数据写入 JSON 文件
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

            // 将数据存入 Map
            Map<String, Object> jsonData = new HashMap<>();
            jsonData.put("htmlFiles", convertToRelativePaths(filePaths.get("html"), sanitizedFilename));
            jsonData.put("cssFiles", convertToRelativePaths(filePaths.get("css"), sanitizedFilename));
            jsonData.put("imageFiles", convertToRelativePaths(filePaths.get("images"), sanitizedFilename));
            jsonData.put("toc", tocList);
            System.out.println("tocList是"+tocList);

            // 写入 JSON 文件
            objectMapper.writeValue(jsonFile, jsonData);

            // 返回相对路径
            response.put("jsonPath", jsonFilePath);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "An error occurred while processing the EPUB file.");
        }
        return response;
    }

    // 解压 EPUB 文件并提取相关文件路径
    private Map<String, List<String>> unzipEpub(InputStream epubInputStream, File destination) {
        Map<String, List<String>> filePaths = new HashMap<>();
        filePaths.put("html", new ArrayList<>());
        filePaths.put("css", new ArrayList<>());
        filePaths.put("images", new ArrayList<>());

        try (ZipInputStream zipInputStream = new ZipInputStream(epubInputStream)) {
            ZipEntry entry;
            while ((entry = zipInputStream.getNextEntry()) != null) {
                File entryFile = new File(destination, entry.getName());
                if (entry.isDirectory()) {
                    entryFile.mkdirs();
                } else {
                    // 创建文件夹和文件
                    entryFile.getParentFile().mkdirs();
                    try (var outputStream = new FileOutputStream(entryFile)) {
                        byte[] buffer = new byte[1024];
                        int length;
                        while ((length = zipInputStream.read(buffer)) > 0) {
                            outputStream.write(buffer, 0, length);
                        }
                    }

                    // 根据文件类型，将路径记录到相应的列表中
                    String filePath = entryFile.getAbsolutePath();
                    if (filePath.endsWith(".html") || filePath.endsWith(".htm") || filePath.endsWith(".xhtml")) {
                        //System.out.println("html地址："+filePath);
                        filePaths.get("html").add(filePath);
                    } else if (filePath.endsWith(".css")) {
                        filePaths.get("css").add(filePath);
                    } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg") || filePath.endsWith(".png") || filePath.endsWith(".gif")) {
                        filePaths.get("images").add(filePath);
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Error while unzipping EPUB file.", e);
        }

        return filePaths;
    }


    // 提取 OPF 文件路径
    private String extractOpfPath(File containerFile) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(containerFile);
        NodeList nodeList = document.getElementsByTagName("rootfile");
        if (nodeList.getLength() > 0) {
            Element rootfileElement = (Element) nodeList.item(0);
            return rootfileElement.getAttribute("full-path");
        }
        return null;
    }

    private List<Map<String, Object>> loadBookFromOpf(File opfFile) throws Exception {
        try (InputStream opfInputStream = new FileInputStream(opfFile)) {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(opfInputStream);

            // 解析 Manifest 和 Spine，手动处理书籍大纲
            NodeList manifestItems = document.getElementsByTagName("item");
            Map<String, String> manifestMap = new HashMap<>();
            String ncxFilePath = null;
            for (int i = 0; i < manifestItems.getLength(); i++) {
                Element item = (Element) manifestItems.item(i);
                String href = item.getAttribute("href");
                String id = item.getAttribute("id");
                String mediaType = item.getAttribute("media-type");
                if ("application/x-dtbncx+xml".equals(mediaType)) {
                    File opfParentDir = opfFile.getParentFile();
                    ncxFilePath = new File(opfParentDir, href).getAbsolutePath();
                    System.out.println("ncxFilePath是：" + ncxFilePath); // 获取 NCX 文件的路径
                }
                manifestMap.put(id, href); // 保存 Manifest 中的项（通过id与href对应）
                //System.out.println("Manifest Item: " + id + " -> " + href);
            }

            // 解析 Spine
            List<String> spineIds = new ArrayList<>();
            NodeList spineItems = document.getElementsByTagName("itemref");
            for (int i = 0; i < spineItems.getLength(); i++) {
                Element itemRef = (Element) spineItems.item(i);
                String ref = itemRef.getAttribute("idref");
                spineIds.add(ref); // 保存 Spine 中引用的 Manifest Item id
                //System.out.println("Spine ItemRef: " + ref);
            }

            // 通过 Manifest 和 Spine 获取最终的大纲
            List<Map<String, Object>> tocList = new ArrayList<>();
            for (String spineId : spineIds) {
                String href = manifestMap.get(spineId);
                String title = HrefToTitle(href, ncxFilePath);
                //System.out.println("title:" + title);
                if (href != null && !Objects.equals(title, "No Title Found")) {
                    Map<String, Object> tocItem = new HashMap<>();
                    tocItem.put("title", title);
                    tocItem.put("href", href); // 关联 Manifest 中的 href
                    tocList.add(tocItem);
                }
            }

            for (Map<String, Object> tocItem : tocList) {
                Map<String, Object> formattedTocItem = new HashMap<>();
                for (Map.Entry<String, Object> entry : tocItem.entrySet()) {
                    formattedTocItem.put(entry.getKey().replace("=", "："), entry.getValue());
                }
                tocList.set(tocList.indexOf(tocItem), formattedTocItem);
            }
            return tocList; // 返回最终格式化的 tocList
        }
    }

    private String HrefToTitle(String href, String ncxFilePath) {
        try {
            // 直接使用绝对路径（File对象）
            File ncxFile = new File(ncxFilePath);
            if (!ncxFile.exists()) {
                throw new FileNotFoundException("File not found: " + ncxFilePath);
            }

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(ncxFile);  // 直接用 File 来解析

            NodeList navPoints = document.getElementsByTagName("navPoint");
            for (int i = 0; i < navPoints.getLength(); i++) {
                Element navPoint = (Element) navPoints.item(i);
                String contentHref = navPoint.getElementsByTagName("content").item(0)
                        .getAttributes().getNamedItem("src").getNodeValue();

                // 判断 href 是否包含 contentHref
                if (contentHref.contains(href)) {
                    String title = navPoint.getElementsByTagName("navLabel").item(0).getTextContent();
                    return title;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return "No Title Found";
    }

    // 将文件路径转换为相对路径
    private List<String> convertToRelativePaths(List<String> absolutePaths, String sanitizedFilename) {
        List<String> relativePaths = new ArrayList<>();
        for (String absolutePath : absolutePaths) {
            String relativePath = absolutePath.substring(absolutePath.indexOf("temp-" + sanitizedFilename) + ("temp-" + sanitizedFilename).length() + 1);
            relativePath = relativePath.replace("\\", "/");
            relativePath = "/Readeruser/epub/temp-" + sanitizedFilename + "/" + relativePath;
            relativePaths.add(relativePath);
        }
        return relativePaths;
    }

    @GetMapping("/Readeruser/epub/temp-{filename}/data.json")
    public ResponseEntity<Resource> getJsonFile(@PathVariable String filename) throws IOException {
        File file = new File("Readeruser/epub/temp-" + filename + "/data.json");
        Path path = file.toPath();
        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename*=UTF-8''" + URLEncoder.encode("data.json", StandardCharsets.UTF_8))
                .body(resource);
    }

    @GetMapping("/Readeruser/epub/{filename}/**")
    public ResponseEntity<Resource> getHtmlFile(@PathVariable String filename, HttpServletRequest request) throws IOException {
        //System.out.println("filename:"+filename);
        String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");// 获取完整的URL路径
        String fullPath = request.getRequestURI();
        //System.out.println("fullPath:"+fullPath);
        String endPath=fullPath.replaceFirst("/Readeruser/epub/"+encodedFilename, "");
        //System.out.println("尾端路径是："+endPath);
        File file = new File("Readeruser/epub/" + filename + "/" + endPath);
        Path path = file.toPath();
        String fileExtension = getFileExtension(file.getName());

        MediaType contentType = null;
        if (fileExtension.equalsIgnoreCase("html") || fileExtension.equalsIgnoreCase("htm")||fileExtension.equalsIgnoreCase("xhtml")) {
            contentType = MediaType.TEXT_HTML;
        } else if (fileExtension.equalsIgnoreCase("css")) {
            contentType = MediaType.valueOf("text/css");
        } else if (fileExtension.equalsIgnoreCase("jpg") || fileExtension.equalsIgnoreCase("jpeg")||fileExtension.equalsIgnoreCase("png")||fileExtension.equalsIgnoreCase("gif")) {
            contentType = MediaType.IMAGE_JPEG;
        }
        Resource resource = new UrlResource(path.toUri());
        assert contentType != null;
        return ResponseEntity.ok()
                .contentType(contentType)
                .header("Content-Disposition", "attachment; filename*=UTF-8''" + URLEncoder.encode("data.json", StandardCharsets.UTF_8))
                .body(resource);
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }
}