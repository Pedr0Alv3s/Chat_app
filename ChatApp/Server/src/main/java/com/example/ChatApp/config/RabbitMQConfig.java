package com.example.ChatApp.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // 1. Exchange de Entrada (Para salvar no banco)
    public static final String CHAT_INCOMING_EXCHANGE = "chat.incoming.exchange";
    public static final String CHAT_SAVE_QUEUE = "chat.save.queue";

    // 2. Exchange de Broadcast (Para avisar todos os servidores em tempo real)
    public static final String CHAT_BROADCAST_EXCHANGE = "chat.broadcast.fanout";

    @Bean
    public TopicExchange incomingExchange() {
        return new TopicExchange(CHAT_INCOMING_EXCHANGE);
    }

    @Bean
    public Queue saveQueue() {
        return new Queue(CHAT_SAVE_QUEUE, true);
    }

    @Bean
    public Binding bindingSave(Queue saveQueue, TopicExchange incomingExchange) {
        return BindingBuilder.bind(saveQueue).to(incomingExchange).with("chat.key");
    }

    @Bean
    public FanoutExchange broadcastExchange() {
        return new FanoutExchange(CHAT_BROADCAST_EXCHANGE);
    }

    // Fila exclusiva de cada instância para ouvir o broadcast
    @Bean
    public Queue instanceBroadcastQueue() {
        return new AnonymousQueue();
    }

    @Bean
    public Binding bindingBroadcast(Queue instanceBroadcastQueue, FanoutExchange broadcastExchange) {
        return BindingBuilder.bind(instanceBroadcastQueue).to(broadcastExchange);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return new Jackson2JsonMessageConverter(mapper);
    }
}
