package com.mikelearner.backend;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.interactive.action.*;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
import org.apache.pdfbox.rendering.PDFRenderer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@RestController("pdfreaderr")
public class pdfreader {

    @PostMapping("/pdfpass")
    public Map<String, Object> handleFileUpload(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        String jsonFilePath = null;

        try (InputStream inputStream = file.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {

            StringBuilder bookmarkInfo = new StringBuilder("\n");
            PDDocumentCatalog catalog = document.getDocumentCatalog();
            PDDocumentOutline outline = catalog.getDocumentOutline();
            if (outline != null) {
                printBookmarks(document, outline.getFirstChild(), bookmarkInfo, "");
                System.out.println(bookmarkInfo);
            } else {
                System.out.println("There's not bookmark we could find out!");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                originalFilename = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
            }
            assert originalFilename != null;
            String sanitizedFilename = originalFilename.replaceAll("[\\p{P}\\s]+", "_");
            File tempDir = new File("Readeruser/pdf/temp-" + sanitizedFilename);
            if (!tempDir.exists()) {
                tempDir.mkdirs();
            }

            File jsonFile = new File(tempDir, "data.json");
            if (jsonFile.exists()) {
                jsonFilePath = "/Readeruser/pdf/temp-" + sanitizedFilename + "/data.json";
                response.put("jsonPath", jsonFilePath);
                return response;
            }

            List<String> imagePaths = new ArrayList<>();
            int totalPages = document.getNumberOfPages();
            ExecutorService executor = Executors.newFixedThreadPool(10);
            List<Future<String>> futures = new ArrayList<>();

            for (int page = 0; page < totalPages; page++) {
                final int pageIndex = page;
                futures.add(executor.submit(() -> {
                    try {
                        PDFRenderer pdfRenderer = new PDFRenderer(document);
                        BufferedImage bufferedImage = pdfRenderer.renderImageWithDPI(pageIndex, 300);
                        File outputFile = new File(tempDir, "page_" + pageIndex + ".png");
                        ImageIO.write(bufferedImage, "PNG", outputFile);
                        String encodedFilename = URLEncoder.encode(sanitizedFilename, StandardCharsets.UTF_8);
                        return "/images/" + encodedFilename + "/page_" + pageIndex + ".png";
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                }));
            }

            for (Future<String> future : futures) {
                String path = future.get();
                if (path != null) {
                    imagePaths.add(path);
                }
            }
            executor.shutdown();

            BufferedImage firstImage = new PDFRenderer(document).renderImageWithDPI(0, 300);
            float width = firstImage.getWidth();
            float height = firstImage.getHeight();
            response.put("bookname", originalFilename);
            response.put("bookmarkInfo", bookmarkInfo.toString());
            response.put("imagePaths", imagePaths);
            response.put("width", width);
            response.put("height", height);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(jsonFile, response);
            jsonFilePath = "/Readeruser/pdf/temp-" + sanitizedFilename + "/data.json";

        } catch (IOException | InterruptedException | ExecutionException e) {
            e.printStackTrace();
            response.put("error", "Failed to process file: " + e.getMessage());
        }
        response.put("jsonPath", jsonFilePath);
        return response;
    }

    @GetMapping("/Readeruser/pdf/temp-{filename}/data.json")
    public ResponseEntity<Resource> getJsonFile(@PathVariable String filename) throws IOException {
        File file = new File("Readeruser/pdf/temp-" + filename + "/data.json");
        Path path = file.toPath();
        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename*=UTF-8''" + URLEncoder.encode("data.json", StandardCharsets.UTF_8))
                .body(resource);
    }

    @GetMapping("/images/{filename}/{page}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename, @PathVariable String page) throws IOException {
        File file = new File("Readeruser/pdf/temp-" + filename + "/" + page);
        Path path = file.toPath();
        Resource resource = new UrlResource(path.toUri());
        String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header("Content-Disposition", "attachment; filename*=UTF-8''" + URLEncoder.encode(decodedFilename, StandardCharsets.UTF_8))
                .body(resource);
    }

    private static void printBookmarks(PDDocument document, PDOutlineItem outlineItem, StringBuilder bookmarkInfo, String indent) throws IOException {
        while (outlineItem != null) {
            String title = outlineItem.getTitle();
            int pageNumber = findPageNumber(document, outlineItem);
            if (pageNumber == -1) {
                bookmarkInfo.append(indent).append(title).append(" - Page: Unknown").append("\n");
            } else {
                bookmarkInfo.append(indent).append(title).append(" - Page: ").append(pageNumber).append("\n");
            }

            if (outlineItem.hasChildren()) {
                printBookmarks(document, outlineItem.getFirstChild(), bookmarkInfo, indent + "    ");
            }
            outlineItem = outlineItem.getNextSibling();
        }
    }

    private static int findPageNumber(PDDocument document, PDOutlineItem outlineItem) throws IOException {
        // 检查书签的目标是否为 PDPageDestination
        if (outlineItem.getDestination() instanceof PDPageDestination) {
            PDPageDestination pageDestination = (PDPageDestination) outlineItem.getDestination();
            PDPage page = pageDestination.getPage();
            return document.getPages().indexOf(page) + 1;
        }

        // 检查书签目标是否为 PDActionGoTo 类型
        if (outlineItem.getAction() instanceof PDActionGoTo) {
            PDActionGoTo goToAction = (PDActionGoTo) outlineItem.getAction();
            PDPageDestination pageDestination = (PDPageDestination) goToAction.getDestination();
            if (pageDestination instanceof PDPageDestination) {
                PDPage page = pageDestination.getPage();
                return document.getPages().indexOf(page) + 1;
            }
        }

        // 检查书签目标是否为 PDActionURI 类型
        if (outlineItem.getAction() instanceof PDActionURI) {
            PDActionURI uriAction = (PDActionURI) outlineItem.getAction();
            String uri = uriAction.getURI();
            System.out.println("Bookmark points to URI: " + uri);
            return -1;
        }

        // 如果目标既不是上述类型，返回 -1
        return -1;
    }
}