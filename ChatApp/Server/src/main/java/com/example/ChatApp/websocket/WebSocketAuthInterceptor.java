package com.example.ChatApp.websocket;

import com.example.ChatApp.security.JwtService;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor {
    private final JwtService jwtService;

    public WebSocketAuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        System.out.println(">>> Handshake chegou no interceptor (MOCK MODE)");

        try {
            /* 
             * Mock: Simula o usuário logado com id 1L
             * (Para testar o chat real-time sem token válido)
             */
            Long mockUserId = 1L;
            attributes.put("userId", mockUserId);
            System.out.println("WebSocket MOCK autenticado: userId=" + mockUserId);
            return true;

            /* LOGICA ORIGINAL COMENTADA
            String query = request.getURI().getQuery();
            if (query == null) {
                System.out.println("❌ Sem query");
                return false;
            }

            Map<String, String> params = Arrays.stream(query.split("&"))
                    .map(p -> p.split("="))
                    .filter(p -> p.length == 2)
                    .collect(Collectors.toMap(p -> p[0], p -> p[1]));

            String token = params.get("token");
            if (token == null || token.isBlank()) {
                System.out.println("Token ausente");
                return false;
            }

            if (!jwtService.isValid(token)) {
                System.out.println("Token inválido");
                return false;
            }

            Long userId = jwtService.extractUserId(token);
            attributes.put("userId", userId);
            System.out.println("WebSocket autenticado: userId=" + userId);
            return true;
            */
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }
    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {}

}
