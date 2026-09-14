package com.ecoverse.backend.dto;

public class AssistantResponseDTO {
    private String answer;

    public AssistantResponseDTO() {
    }

    public AssistantResponseDTO(String answer) {
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
