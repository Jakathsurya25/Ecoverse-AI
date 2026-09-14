package com.ecoverse.backend.controller;

import com.ecoverse.backend.dto.AssistantRequestDTO;
import com.ecoverse.backend.dto.AssistantResponseDTO;
import com.ecoverse.backend.service.AssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
@CrossOrigin(origins = "*")
public class AssistantController {

    private final AssistantService assistantService;

    @Autowired
    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping
    public ResponseEntity<AssistantResponseDTO> askAssistant(@RequestBody AssistantRequestDTO request) {
        AssistantResponseDTO response = assistantService.ask(request);
        return ResponseEntity.ok(response);
    }
}
