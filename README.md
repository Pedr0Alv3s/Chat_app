# Chat_app
Este repositório apresenta a implementação de um sistema de chat em tempo real, desenvolvido como parte da disciplina de Sistemas Distribuídos.

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

|Nº|Requisito|Descrição|
|---|---|---|
|RF1| Registro de usuário| O usuário deve conseguir criar um registro com email e senha|
|RF2| Login de usuário| O usuário deve conseguir realizaro login com os dados usados no registro|
|RF3| Criação de salas| O usuário deve conseguir criar salas de chat|
|RF4| Convite para sala| O usuário deve conseguir convidar outros usuários para sua sala|
|RF5| Aceitar/Recusar convite| O usuário deve conseguir aceitar ou recusar convites de outros usuários|
|RF6| Envio de mensagens| O usuário deve conseguir enviar mensagens de texto nas salas da qual participa|
|RF7| Persistência de mensagens| As mensagens enviadas tem de ser salvas para visualização após o periodo de conexão|
