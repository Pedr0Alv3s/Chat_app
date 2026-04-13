package com.example.ChatApp.service;

import com.example.ChatApp.config.RabbitMQConfig;
import com.example.ChatApp.dto.RabbitMQMessageDTO;
import com.example.ChatApp.dto.roomOp.MensagemDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageReceiver {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageReceiver(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = RabbitMQConfig.CHAT_QUEUE)
    public void processMessage(RabbitMQMessageDTO payload) {
        System.out.println(">>> Consumindo do RabbitMQ a mensagem de sala " + payload.getMensagemRequestDTO().getSala_id());

        // 1. Salva no banco de dados via ChatService
        MensagemDTO savedMessage = chatService.enviar(payload.getMensagemRequestDTO(), payload.getUserId());

        // 2. Faz o broadcast para quem está na sala
        String destination = "/topic/rooms/" + savedMessage.getSala_Id();
        System.out.println(">>> Broadcasting para: " + destination);
        messagingTemplate.convertAndSend(destination, savedMessage);
    }
}
