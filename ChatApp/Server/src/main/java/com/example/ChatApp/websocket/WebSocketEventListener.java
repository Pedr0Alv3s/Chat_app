package com.example.ChatApp.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        System.out.println("Novo cliente conectado");
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        // 🔥 pega o userId que você salvou no interceptor
        Long userId = (Long) accessor.getSessionAttributes().get("userId");

        if (userId != null) {

            System.out.println("Usuário desconectado: " + userId);

            // 🔹 Exemplo: notificar (opcional)
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "DISCONNECT");
            payload.put("userId", userId);

            // ⚠️ broadcast genérico (você pode melhorar depois)
            messagingTemplate.convertAndSend("/topic/disconnect", Optional.of(payload));
        }
    }
}
