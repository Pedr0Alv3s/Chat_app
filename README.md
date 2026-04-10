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



