package com.pickleball.backend.modules.media.controller;

import com.pickleball.backend.modules.media.service.CloudinaryService;
import com.pickleball.backend.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final CloudinaryService cloudinaryService;

    public MediaController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file, 
                                         @RequestParam(value = "folder", defaultValue = "pickleball/courts") String folder) {
        try {
            String url = cloudinaryService.uploadImage(file, folder);
            return ResponseEntity.ok(ApiResponse.success("Upload successful", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }
}
