package com.example.ChatApp.controller;

import com.example.ChatApp.dto.roomOp.MensagemRequestDTO;
import com.example.ChatApp.dto.roomOp.MensagemDTO;
import com.example.ChatApp.service.ChatService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate){
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void enviar(MensagemRequestDTO dto,
                       @Header("Authorization") String token){

        MensagemDTO mensagem = chatService.enviar(dto, token);

        messagingTemplate.convertAndSend(
                "/topic/rooms/" + dto.getSala_id(), mensagem);

    }

}
