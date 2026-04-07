package com.example.ChatApp.config;

import com.example.ChatApp.websocket.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor interceptor;

    public WebSocketConfig(WebSocketAuthInterceptor interceptor) {
        this.interceptor = interceptor;
        System.out.println("WebSocketConfig carregado");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .addInterceptors(interceptor).setAllowedOrigins("*");;
                //.withSockJS();    // endpoint de conexão opcional
                //.setAllowedOrigins("*"); // ajuste em produção
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");     // onde o servidor publica
        registry.setApplicationDestinationPrefixes("/app"); // onde o cliente envia
    }
}