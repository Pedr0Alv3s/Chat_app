package com.example.ChatApp.dto.roomOp;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AccessResponseDTO {
    public Long sala_id;
    public String sala_name;
    public List<ParticipanteDTO> participantes;
    public List<MensagemDTO> mensagem;
}
