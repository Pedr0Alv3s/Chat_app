# Relatório de Desenvolvimento Final: ChatApp Distribuído

Este documento finaliza o registro das evoluções técnicas aplicadas ao **ChatApp**, consolidando uma arquitetura de alta disponibilidade com RabbitMQ, NGINX e Spring Boot.

## 1. Arquitetura de Mensageria Distribuída (Fanout Pattern)

Para resolver o problema de sincronização entre múltiplas instâncias do servidor, implementamos um fluxo de dois estágios:

- **Estágio 1: Persistência (Fila Compartilhada)**:
    - As mensagens enviadas pelos usuários entram em uma fila única (`chat.save.queue`).
    - Apenas uma instância consome dessa fila e salva a mensagem no banco de dados, garantindo que não haja duplicatas.
- **Estágio 2: Broadcast Global (Fanout Exchange)**:
    - Após o salvamento, o servidor publica a mensagem em um `FanoutExchange`.
    - Cada instância do servidor (8081, 8082, etc.) possui sua própria fila temporária exclusiva (`AnonymousQueue`) ligada a esse exchange.
    - Isso garante que **todas** as instâncias recebam a atualização e possam entregá-la aos seus usuários conectados via WebSocket.

---

## 2. Compatibilidade e Dados

### 2.1. Serialização de Datas (JSR310)
- **Problema**: O Jackson não conseguia serializar `LocalDateTime` para o RabbitMQ por padrão.
- **Solução**: Adicionada a dependência `jackson-datatype-jsr310` e configurado o `ObjectMapper` no `RabbitMQConfig` para registrar o módulo de datas do Java 8.

### 2.2. Padronização de Destinos (Notação de Pontos)
- Para evitar conflitos de caminhos e garantir compatibilidade total com o plugin STOMP do RabbitMQ, padronizamos os endereços de salas no formato `topic/rooms.ID`.

---

## 3. Alta Disponibilidade e Resiliência (Failover)

### 3.1. Balanceamento de Carga (NGINX)
- O NGINX (porta 8080) atua como proxy reverso, distribuindo as conexões entre as instâncias disponíveis. Se um servidor falha, o NGINX redireciona as novas tentativas para as instâncias saudáveis.

### 3.2. Failover Transparente no Frontend
- **Reconexão Automática**: O `WebSocketService` no React foi aprimorado para detectar desconexões e tentar reconectar a cada 3 segundos.
- **Auto-Reinstalação (Auto Re-subscription)**: Implementada uma lógica onde, após uma reconexão bem-sucedida, o serviço reinscreve automaticamente o usuário em todos os tópicos (salas) que ele estava ouvindo.
- **Resultado**: O usuário não precisa recarregar a página (F5) se um servidor cair; o sistema se recupera sozinho de forma invisível.

---

## 4. Configuração do Infraestrutura (NGINX)

Para que o balanceamento de carga e o failover funcionem, o NGINX deve ser configurado como a porta de entrada única (Porta 8080).

### 4.1. Conceitos Aplicados
- **Upstream**: Agrupamos as instâncias do Spring Boot (8081 e 8082) sob um único nome. O NGINX monitora a saúde delas automaticamente.
- **WebSocket Upgrade**: Como WebSockets começam como HTTP e depois mudam de protocolo, configuramos os cabeçalhos `Upgrade` e `Connection` para permitir essa transição.
- **Timeouts Estendidos**: Definimos tempos de leitura/escrita longos para evitar que conexões inativas de chat sejam derrubadas pelo proxy.

### 4.2. Trecho da Configuração (nginx.conf)
```nginx
upstream chat_backend {
    server localhost:8081;
    server localhost:8082;
}

server {
    listen 8080;

    location /ws {
        proxy_pass http://chat_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    location / {
        proxy_pass http://chat_backend;
    }
}
```

---

## 5. Conclusão Técnica
O projeto ChatApp deixou de ser uma aplicação isolada para se tornar um ecossistema distribuído. A combinação de **Spring Boot + RabbitMQ + NGINX** garante que o sistema suporte crescimento horizontal e seja resiliente a falhas individuais de hardware ou software.

---
**Status Final**: ✅ Implementado e Validado.
