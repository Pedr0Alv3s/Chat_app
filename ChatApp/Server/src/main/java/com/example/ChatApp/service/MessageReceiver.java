package com.example.ChatApp.service;

import com.example.ChatApp.config.RabbitMQConfig;
import com.example.ChatApp.dto.RabbitMQMessageDTO;
import com.example.ChatApp.dto.roomOp.MensagemDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageReceiver {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final RabbitTemplate rabbitTemplate;

    public MessageReceiver(ChatService chatService,
            SimpMessagingTemplate messagingTemplate,
            RabbitTemplate rabbitTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = RabbitMQConfig.CHAT_SAVE_QUEUE)
    public void receiveAndSave(RabbitMQMessageDTO payload) {
        try {
            System.out.println(">>> [DB] Iniciando salvamento da mensagem para sala: "
                    + payload.getMensagemRequestDTO().getSala_id());

            MensagemDTO savedMessage = chatService.enviar(payload.getMensagemRequestDTO(), payload.getUserId());

            if (savedMessage != null) {
                System.out.println(">>> [DB] Sucesso ao salvar. Realizando broadcast único...");
                
                // Em vez de mandar para outro exchange do Rabbit, mandamos direto para o tópico STOMP.
                // Como usamos Broker Relay, o RabbitMQ cuidará de entregar para todas as instâncias.
                String destination = "/topic/rooms." + savedMessage.getSala_Id();
                messagingTemplate.convertAndSend(destination, savedMessage);
                
            } else {
                System.err.println(">>> [DB] Erro: ChatService retornou null ao salvar.");
            }
        } catch (Exception e) {
            System.err.println(">>> [ERRO CRÍTICO NO DB LISTENER]: " + e.getMessage());
            e.printStackTrace(); // Isso vai mostrar exatamente onde o código quebrou no seu terminal
        }
    }
}
