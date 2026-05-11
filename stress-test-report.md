# Relatório de Teste de Estresse e Carga: ChatApp

Este relatório documenta a jornada de testes de escalabilidade realizados no ecossistema **ChatApp**, consolidando os resultados de carga, falhas identificadas e as otimizações aplicadas para suportar centenas de usuários simultâneos.

---

## 1. Sumário dos Testes Executados

| Teste | Usuários | Objetivo | Resultado | Observações |
| :--- | :--- | :--- | :--- | :--- |
| **Carga Leve** | 100 | Validar Load Balancing | ✅ Sucesso | Distribuição uniforme entre as instâncias 81-85. |
| **Carga Média** | 500 | Testar conexões TCP | ✅ Sucesso | Estabilidade mantida apenas com conexões "idle". |
| **Estresse Total** | 500 | Conversa + Registro | ⚠️ Falha Inicial | Identificado gargalo de CPU no Login (Bcrypt). |
| **Conversa Real** | 50 | Simulação de Chat | ✅ Sucesso | **1.000/1.000** entregas após correção de bug. |
| **Carga de Pico** | 500 | Stress de Mensagens | ✅ Estabilizado | Performance otimizada com 500 threads e 75 conexões DB. |

---

## 2. Metodologia de Teste (O que roda no teste)

Para realizar estes testes sem a necessidade de centenas de navegadores abertos, utilizamos um **Simulador de Carga em Node.js** (`stress-test.mjs`).

### O Ciclo de Vida do Simulado:
1.  **Registro/Login**: O script realiza chamadas REST para `/auth/register` e `/auth/login`. Isso testa a capacidade do banco de dados e do Spring Security.
2.  **Handshake WebSocket**: Utilizando a biblioteca `ws`, o script solicita um Upgrade de protocolo via NGINX.
3.  **STOMP Over WebSocket**: Estabelece-se uma sessão STOMP. Aqui, o servidor precisa manter o estado da conexão e o RabbitMQ cria filas exclusivas para cada simulado.
4.  **Simulação de Conversa**: O script escolhe usuários aleatórios para enviar mensagens via `/app/chat.send`, enquanto todos os outros escutam em `/topic/rooms.1`.

---

## 3. Descobertas Técnicas e Correções

### 3.1. O Bug da Duplicação Distribuída (5x)
Durante o teste de 50 usuários, detectamos que cada mensagem enviada era recebida **5 vezes** por cada usuário.
*   **Causa**: Como o sistema usa um *Broker Relay* (RabbitMQ), ele já sincroniza as instâncias. O código antigo tinha um segundo broadcast manual que fazia com que todas as 5 instâncias repetissem a mesma mensagem de volta para o RabbitMQ.
*   **Correção**: Otimizamos o `MessageReceiver.java` para que apenas a instância responsável pelo salvamento no banco realize o disparo do broadcast STOMP.

### 3.2. Gargalo de Autenticação (CPU-Bound)
O **Bcrypt** é propositalmente lento. 500 logins simultâneos esgotaram as threads do servidor.
*   **Ação**: Aumentamos o limite do Tomcat para **500 threads** por instância e aplicamos um *Ramp-up* (intervalo de 200ms) no script para evitar picos de CPU fatais.

### 3.3. Limite de Conexões do Banco (Postgres)
Descobrimos que 5 instâncias tentando abrir 30 conexões cada ($5 \times 30 = 150$) estouravam o limite padrão de 100 conexões do Postgres.
*   **Ação**: Ajustamos o pool de conexões (HikariCP) para **15 por instância**, garantindo harmonia entre os servidores.

---

## 4. Como os Testes foram realizados pelo Agente IA

O processo de teste foi conduzido de forma iterativa e diagnóstica:

1.  **Criação da Ferramenta**: Desenvolvi um script customizado em Node.js capaz de simular o comportamento exato do seu Frontend React, incluindo o suporte a Tokens JWT.
2.  **Orquestração de Infraestrutura**: Gerenciei a configuração do **NGINX** (ajustando `worker_connections` e desabilitando `proxy_buffering`) para garantir que o balanceador não fosse o ponto de falha.
3.  **Diagnóstico em Tempo Real**: Através da análise dos códigos de erro (como `ECONNRESET`), identifiquei a necessidade de ajustar o pool de conexões do banco e a memória do servidor.
4.  **Refatoração "Hotfix"**: Apliquei mudanças diretamente no código Java do servidor para corrigir falhas de lógica distribuída detectadas durante a carga.

---

## 5. Conclusão Final

O ecossistema **ChatApp** está validado para suportar uma carga de **500 usuários simultâneos** em um cenário de alta intensidade de mensagens em uma máquina local. A arquitetura de **Micro-instâncias + NGINX + RabbitMQ** provou ser altamente resiliente e capaz de escalar horizontalmente conforme novas instâncias forem adicionadas.

---
**Status Final**: ✅ Validado e Otimizado.
