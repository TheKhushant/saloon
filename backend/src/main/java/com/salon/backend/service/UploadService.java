package com.salon.backend.service;

import com.salon.backend.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadService {

    @Value("${app.uploads.dir}")
    private String uploadsDir;

    @Value("${app.uploads.public-base-url}")
    private String publicBaseUrl;

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp", "gif");

    /**
     * Saves an uploaded image under uploadsDir/{category}/{uuid}.{ext} and
     * returns its public URL. `category` is a caller-controlled path
     * segment (e.g. "products") - not user input - so it's safe to use
     * directly, but the generated filename is always a fresh UUID
     * regardless of the original filename, both to avoid collisions and to
     * avoid trusting any part of a user-supplied filename in a filesystem
     * path (path traversal via "../" etc.).
     */
    public String store(MultipartFile file, String category) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No file was uploaded");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Only JPEG, PNG, WEBP, or GIF images are allowed");
        }

        String extension = extensionFor(contentType);
        String filename = UUID.randomUUID() + "." + extension;

        try {
            Path targetDir = Paths.get(uploadsDir, category).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            Path targetFile = targetDir.resolve(filename).normalize();
            // Defense in depth: even though `filename` is our own generated
            // UUID (not user input), double check the resolved path is
            // still inside targetDir before writing anything to disk.
            if (!targetFile.startsWith(targetDir)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid upload path");
            }

            file.transferTo(targetFile);

            return publicBaseUrl.replaceAll("/$", "") + "/" + category + "/" + filename;
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store the uploaded file");
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            case "image/gif" -> "gif";
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Unsupported image type");
        };
    }
}
