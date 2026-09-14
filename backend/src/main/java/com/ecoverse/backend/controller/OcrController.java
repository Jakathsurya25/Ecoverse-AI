package com.ecoverse.backend.controller;

import com.ecoverse.backend.dto.OcrResponseDTO;
import com.ecoverse.backend.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/scan")
@CrossOrigin(origins = "*")
public class OcrController {

    private final OcrService ocrService;

    @Autowired
    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    @PostMapping
    public OcrResponseDTO scanDocument(@RequestParam("file") MultipartFile file) {
        return ocrService.scanDocument(file);
    }
}
