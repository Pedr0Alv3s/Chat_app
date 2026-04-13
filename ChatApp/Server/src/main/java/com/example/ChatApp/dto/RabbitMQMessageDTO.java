package com.example.ChatApp.dto;

import com.example.ChatApp.dto.roomOp.MensagemRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RabbitMQMessageDTO {
    private Long userId;
    private MensagemRequestDTO mensagemRequestDTO;
}
