package com.example.ChatApp.dto.roomOp;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MensagemDTO {
    private Long id;
    private Long creator_Id;
    private String creator_name;
    private String content;
    private LocalDateTime data;
}
