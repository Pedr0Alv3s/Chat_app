package com.example.ChatApp.dto.roomOp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MensagemRequestDTO {
    private Long sala_id;
    private String content;
}
