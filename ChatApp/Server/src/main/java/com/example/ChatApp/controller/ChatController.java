package com.example.ChatApp.controller;

import com.example.ChatApp.dto.roomOp.MensagemRequestDTO;
import com.example.ChatApp.dto.roomOp.MensagemDTO;
import com.example.ChatApp.service.ChatService;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.ChatApp.dto.RabbitMQMessageDTO;
import com.example.ChatApp.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Controller
public class ChatController {
    private final RabbitTemplate rabbitTemplate;

    public ChatController(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @MessageMapping("/chat.send")
    public void enviar(MensagemRequestDTO dto,
                       SimpMessageHeaderAccessor accessor) {
        System.out.println(">>> WebSocket: Mensagem recebida para sala " + dto.getSala_id());
        Long userId = (Long) accessor.getSessionAttributes().get("userId");
        if (userId == null) {
            System.err.println("❌ Erro: Usuario nao autenticado na sessao WS");
            return;
        }

        System.out.println(">>> Encaminhando para RabbitMQ: " + dto.getContent() + " na sala: " + dto.getSala_id() + " pelo user " + userId);
        RabbitMQMessageDTO payload = new RabbitMQMessageDTO(userId, dto);

        // Envia para o RabbitMQ
        rabbitTemplate.convertAndSend(RabbitMQConfig.CHAT_EXCHANGE, RabbitMQConfig.ROUTING_KEY, payload);
    }
}
