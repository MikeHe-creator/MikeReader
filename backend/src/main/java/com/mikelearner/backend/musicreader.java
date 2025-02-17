package com.mikelearner.backend;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.http.HttpServletRequest;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@RestController
public class musicreader {

    @PostMapping("/musicJiexi")
    public Map<String, Object> musicJiexi(@RequestParam("file") MultipartFile file) throws IOException {
        Map<String, Object> musicInfo = new HashMap<>();
        String jsonFilePath = "";
        String fileName = file.getOriginalFilename();
        assert fileName != null;
        String basePath = System.getProperty("User.dir") + File.separator + "Readeruser" + File.separator + "music";
        File tempDir = new File(basePath + File.separator + "temp-" + fileName);
        if (!tempDir.exists()) {
            tempDir.mkdirs();
        }
        File musicFile = new File(tempDir, fileName);
        file.transferTo(musicFile);
        File jsonFile = new File(tempDir, "data.json");
        if (jsonFile.exists()) {
            jsonFilePath = "/Readeruser/music/temp-" + fileName + "/data.json";
            musicInfo.put("jsonPath", jsonFilePath);
            return musicInfo;
        }

        try {
            System.out.println("歌曲文件名：" + file.getOriginalFilename());
            AudioFile audioFile = AudioFileIO.read(musicFile);
            Tag tag = audioFile.getTag();
            jsonFilePath = "/Readeruser/music/temp-" + fileName + "/data.json";

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
            if(tag != null){
                musicInfo.put("artist", tag.getFirst(FieldKey.ARTIST));
                musicInfo.put("album", tag.getFirst(FieldKey.ALBUM));
                musicInfo.put("title", tag.getFirst(FieldKey.TITLE));
                if (tag.getFirstArtwork() != null) {
                    byte[] artwork = tag.getFirstArtwork().getBinaryData();
                    File coverFile = new File(tempDir, "cover.png");
                    BufferedImage image = ImageIO.read(new java.io.ByteArrayInputStream(artwork));
                    ImageIO.write(image, "PNG", coverFile);
                    musicInfo.put("cover", "/Readeruser/music/temp-" + fileName + "/cover.png");
                } else {
                    musicInfo.put("cover", null);
                }
            }else{
                musicInfo.put("artist", "");
                musicInfo.put("album", "");
                musicInfo.put("title", "");
                musicInfo.put("cover", null);
            }
            musicInfo.put("duration", audioFile.getAudioHeader().getTrackLength());

            objectMapper.writeValue(jsonFile, musicInfo);
        } catch (Exception e) {
            e.printStackTrace();
            musicInfo.put("error", "文件解析失败");
        }
        musicInfo.put("jsonPath", jsonFilePath);
        return musicInfo;
    }

    @GetMapping("/Readeruser/music/temp-{filename}/**")
    public ResponseEntity<Resource> getFile(@PathVariable String filename, HttpServletRequest request) throws IOException {
        String path = request.getRequestURI();
        if (path.contains("data.json")) {
            File jsonFile = new File("Readeruser/music/temp-" + filename + "/data.json");
            if (!jsonFile.exists()) {
                return ResponseEntity.notFound().build();
            }
            Path jsonPath = jsonFile.toPath();
            Resource resource = new UrlResource(jsonPath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Content-Disposition", "attachment; filename*=UTF-8''" + URLEncoder.encode("data.json", StandardCharsets.UTF_8))
                    .body(resource);
        } else if (path.contains("cover.png")) {
            File coverFile = new File("Readeruser/music/temp-" + filename + "/cover.png");
            if (!coverFile.exists()) {
                return ResponseEntity.notFound().build();
            }
            Path coverPath = coverFile.toPath();
            Resource resource = new UrlResource(coverPath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .header("Content-Disposition", "attachment; filename*=UTF-8''" + URLEncoder.encode("cover.png", StandardCharsets.UTF_8))
                    .body(resource);
        } else {
            File musicFile = new File("Readeruser/music/temp-" + filename + "/" + filename);
            System.out.println("musicFile: " + musicFile);
            if (!musicFile.exists()) {
                return ResponseEntity.notFound().build();
            }
            Path musicPath = musicFile.toPath();
            Resource resource = new UrlResource(musicPath.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header("Content-Disposition", "attachment; filename*=UTF-8''" + URLEncoder.encode(filename, StandardCharsets.UTF_8))
                    .body(resource);
        }
    }
}