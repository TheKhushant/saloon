package com.salon.backend.controller;

import com.salon.backend.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    @PostMapping("/products")
    public Map<String, String> uploadProductImage(@RequestParam("file") MultipartFile file) {
        return Map.of("url", uploadService.store(file, "products"));
    }

    @PostMapping("/services")
    public Map<String, String> uploadServiceImage(@RequestParam("file") MultipartFile file) {
        return Map.of("url", uploadService.store(file, "services"));
    }

    @PostMapping("/templates")
    public Map<String, String> uploadTemplateImage(@RequestParam("file") MultipartFile file) {
        return Map.of("url", uploadService.store(file, "templates"));
    }
}
