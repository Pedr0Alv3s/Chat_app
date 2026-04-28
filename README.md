# Chat_app
Este repositório apresenta a implementação de um sistema de chat em tempo real, desenvolvido como parte da disciplina de Sistemas Distribuídos.

Alunos: Pedro Alves de Moraes Medeiros, Gabriel Moraes e Angelo Salvatti

## Descrição
O objetivo do projeto é construir uma aplicação distribuída baseada no modelo cliente-servidor, na qual os clientes enviam requisições que são processadas centralmente pelo servidor. Nesse modelo, o servidor é responsável por receber, tratar e encaminhar as solicitações dos usuários.

Um exemplo desse funcionamento é o envio de mensagens: quando um usuário envia uma mensagem, o servidor a recebe, realiza o processamento necessário e a distribui para os demais usuários conectados à mesma sala ou sessão.

O projeto contém duas aplicações centrais, a aplicação Servidor, que será responsável por "escutar" e servir, e a aplicação Cliente, responsável por ser a interface de uso do usuário, que fará as requisições;

## Arquitetura
<img width="639" height="568" alt="image" src="https://github.com/user-attachments/assets/bbb03ed8-8b63-428a-8b74-0d484b736551" />

### Descrição dos componentes:
  **Client** -> Responsável por enviar requisições via HTTP (operações como autenticação, criação de salas, etc.) e manter conexões via WebSocket para comunicação em tempo real, como envio e recebimento de mensagens.
  
  **Websocket Server**   -> Componente responsável por gerenciar conexões persistentes com os clientes. Permite a comunicação bidirecional em tempo real, recebendo mensagens dos clientes e encaminhando eventos (como novas mensagens) de volta para os usuários conectados.
  
  **Broker**             -> Sistema intermediário de mensageria responsável por desacoplar os componentes da arquitetura. Recebe mensagens do WebSocket Server ou da API e as distribui para os Workers, garantindo escalabilidade e maior tolerância a falhas.
  
  **Worker**             -> Serviço responsável pelo processamento assíncrono das mensagens recebidas do Broker. Pode realizar validações, regras de negócio, persistência de dados e preparação das mensagens antes de serem distribuídas aos clientes.
  
  **API**                -> Interface baseada em HTTP responsável por expor os endpoints da aplicação. Gerencia operações síncronas como autenticação, cadastro de usuários, criação de salas e outras funcionalidades administrativas do sistema.
  
  **Banco de dados**     -> Responsável pelo armazenamento persistente das informações da aplicação.

## Tabela de requisitos

### Requisitos funcionais
|Nº|Requisito|Descrição|
|---|---|---|
|RF1| Registro de usuário| O usuário deve conseguir criar um registro com email e senha|
|RF2| Login de usuário| O usuário deve conseguir realizaro login com os dados usados no registro|
|RF3| Criação de salas| O usuário deve conseguir criar salas de chat|
|RF4| Convite para sala| O usuário deve conseguir convidar outros usuários para sua sala|
|RF5| Aceitar/Recusar convite| O usuário deve conseguir aceitar ou recusar convites de outros usuários|
|RF6| Envio de mensagens| O usuário deve conseguir enviar mensagens de texto nas salas da qual participa|
|RF7| Persistência de mensagens| As mensagens enviadas tem de ser salvas para visualização em futuros acessos dos usuários participantes da conversa|

### Requisitos não-funcionais
|Nº|Requisito|Descrição|
|---|---|---|
|RNF1|	Desempenho em tempo real|	O sistema deve garantir baixa latência no envio e recebimento de mensagens|
|RNF2|	Escalabilidade|	A aplicação deve ser capaz de suportar o aumento no número de usuários simultâneos, permitindo a adição de novos nós (ex: Workers) sem impacto significativo no desempenho.|
|RNF3|	Disponibilidade|	O sistema deve permanecer disponível na maior parte do tempo, com tolerância a falhas em componentes como Broker ou Workers.|
|RNF4|	Consistência de dados|	As mensagens enviadas devem ser corretamente persistidas no banco de dados, evitando perda ou duplicação de dados.|
|RNF5|	Segurança de autenticação|	O sistema deve garantir autenticação segura, protegendo credenciais de usuários com uso de criptografia de senha e tokens de acesso.|
|RNF6|	Integridade de mensagens|	As mensagens não devem ser alteradas durante o tráfego entre cliente, servidor e demais componentes do sistema.|
|RNF7|	Manutenibilidade|	O sistema deve possuir uma arquitetura modular (ex: separação entre API, WebSocket, Broker e Workers), facilitando manutenção e evolução.|
|RNF8|	Observabilidade|	A aplicação deve possuir mecanismos de logging e monitoramento para rastrear erros, eventos e fluxo de mensagens.|
|RNF9|	Usabilidade|	A interface do cliente deve permitir interação simples e intuitiva para envio de mensagens, gerenciamento de salas e convites.|
|RNF10|	Tempo de recuperação|	Em caso de falha, o sistema deve ser capaz de se recuperar rapidamente, retomando o processamento de mensagens sem perda significativa.|

## Guia de Endpoints
Esta seção tem o objetivo de apresentar e descrever as principais rotas disponíveis para interação com o sistema.

### Endpoints de usuário:
 Os Endpoints relacionados a usuário, como registro e login estão sobre a rota /auth/. 
 portanto temos suas rotas completas como: [endereço do servidor]:8080/auth/register e [endereço do servidor]:8080/auth/login, respectivamente.
 Suas funções são de criação e autenticação de usuário. Sendo somente possível realizar outras interações com a aplicação com um login existente e o token de segurança gerado nesse processo.

### Endpoints referentes a interações com Salas:
Salas são os espaços de conversas entre usuários, seus endpoints estão sobre a rota /rooms/
 -> /create         -> Rota para a criação de salas;
 -> {salaId}/invite -> Rota para envio de convite para a sala especificada pelo id;
 -> {salaId}/access -> Rota de acesso de uma sala;

### Endpoints referentes a chats:
 -> /chat.send (WebSocket) -> Destino para o envio de mensagens em tempo real.

---

## 🚀 Como Rodar o Projeto

Este guia ajudará você a configurar o ambiente e executar tanto o servidor quanto o cliente.

### 📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
*   **Java 17** ou superior.
*   **Node.js** (v18+) e **npm**.
*   **PostgreSQL** (Banco de dados relacional).
*   **RabbitMQ** (Broker de mensageria).
*   **NGINX** (Proxy reverso).

---

### 🛠️ Passo 1: Configuração do RabbitMQ
O ChatApp utiliza o RabbitMQ com o protocolo STOMP. Siga os passos abaixo no seu terminal (Linux/WSL):
Guia de instalação: https://www.rabbitmq.com/docs/download#installation-guides

Para modelos linux:
1.  **Instale o RabbitMQ**:
    ```bash
    sudo apt update && sudo apt install rabbitmq-server -y
    ```
2.  **Habilite os Plugins Necessários**:
    ```bash
    sudo rabbitmq-plugins enable rabbitmq_stomp rabbitmq_management
    ```
3.  **Inicie o Serviço**:
    ```bash
    sudo service rabbitmq-server start
    ```
4.  **Crie um Usuário (Opcional)**: O sistema usa `guest/guest` por padrão para localhost, mas você pode configurar outros usuários via painel: [http://localhost:15672](http://localhost:15672).

---

###  Passo 2: Configuração do Banco de Dados (PostgreSQL)
1.  Crie um banco de dados chamado `postgres` no seu servidor PostgreSQL.
2.  Configure as credenciais no arquivo do backend:
    `ChatApp/Server/src/main/resources/application.properties`
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
    spring.datasource.username=seu_usuario
    spring.datasource.password=sua_senha
    spring.jpa.hibernate.ddl-auto = update
    server.port=${PORT:8081} ## Porta padrão se não fornecida via --server.port
    ```

---

###  Passo 3: Configurando o NGINGX:
1. **Instale o NGINGX**: https://nginx.org/en/download.html
2. ** Configure o nginx.conf
    ```bash
   #user  nobody;
   worker_processes  1;
   
   #error_log  logs/error.log;
   #error_log  logs/error.log  notice;
   #error_log  logs/error.log  info;
   
   #pid        logs/nginx.pid;
   
   
   events {
       worker_connections  1024;
   }
   
   
   http {
       upstream chat_backend {
           # Define as instâncias do servidor Spring Boot
           server localhost:8081;
           server localhost:8082;
       }
   
       server {
           listen 8080;
           server_name localhost;
   
           # Configuração para WebSocket (STOMP)
           location /ws {
               proxy_pass http://chat_backend;
               proxy_http_version 1.1;
               proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection "Upgrade";
               proxy_set_header Host $host;
               
               # Timeouts para evitar que a conexão caia prematuramente
               proxy_read_timeout 86400s;
               proxy_send_timeout 86400s;
           }
   
           # Configuração para API REST (Login, Cadastro, etc)
           location / {
               proxy_pass http://chat_backend;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }
       }
   }
    ```
    3. Inicie o nginx.exe  
    
###  Passo 4: Rodando uma instância do Backend (Spring Boot)
Navegue até a raiz do projeto e execute:
```bash
./gradlew :ChatApp:Server:bootRun --args='--server.port=[porta desejada] ex 8081, 8082
```
O servidor estará disponível em `http://localhost:8080`.

---

### ⚛️ Passo 4: Rodando o Frontend (React)
Navegue até a pasta do frontend e inicie o ambiente de desenvolvimento:
```bash
cd frontend/FrontChat
npm install
npm run dev
```
Acesse `http://localhost:5173` no seu navegador.

---

## 🧠 Como funciona a comunicação?
1.  **Envio**: O Cliente React envia a mensagem via **WebSocket** para o endpoint `/app/chat.send`.
2.  **Encaminhamento**: O Servidor recebe, valida e envia para uma **Exchange do RabbitMQ**.
3.  **Processamento**: Um **Worker** (MessageReceiver) consome a mensagem da fila, salva no Banco de Dados e então faz o broadcast para todos os usuários inscritos no tópico da sala via **STOMP**.



