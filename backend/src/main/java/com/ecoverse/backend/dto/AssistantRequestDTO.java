package com.ecoverse.backend.dto;

public class AssistantRequestDTO {
    private String message;

    public AssistantRequestDTO() {
    }

    public AssistantRequestDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
