import { Client } from '@stomp/stompjs';
import WebSocket from 'ws';
import fetch from 'node-fetch';

// CONFIGURAÇÕES
const BASE_URL = 'http://localhost:8080';
const WS_URL = 'ws://localhost:8080/ws/websocket'; // Endpoint via NGINX (Proxy Reverso)
const NUM_USERS = process.env.USERS || 50;
const CONCURRENCY_DELAY = 200; // Aumentado para 200ms para dar mais fôlego ao servidor no login

async function registerAndLogin(index) {
    const email = `testuser${index}@stress.com`;
    const password = 'password123';
    const name = `Stress User ${index}`;

    try {
        // 1. Tentar registrar (ignorar erro se já existir)
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        }).catch(() => { }); // Ignora erros de registro (ex: usuário já existe)

        // 2. Fazer Login para obter o Token
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (loginRes.ok) {
            const data = await loginRes.json();
            return data.token;
        }
    } catch (error) {
        console.error(`Erro no setup do usuário ${index}:`, error.message);
    }
    return null;
}

let totalMessagesReceived = 0;

async function connectUser(index, token) {
    return new Promise((resolve) => {
        const stompClient = new Client({
            brokerURL: `${WS_URL}?token=${token}`,
            webSocketFactory: () => new WebSocket(`${WS_URL}?token=${token}`),
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = (frame) => {
            // Subscreve a uma sala comum (ID 1)
            const salaId = 1;
            stompClient.subscribe(`/topic/rooms.${salaId}`, (message) => {
                totalMessagesReceived++;
                if (totalMessagesReceived % 500 === 0) {
                    console.log(`💬 Total de entregas de mensagens: ${totalMessagesReceived}`);
                }
            });

            resolve(stompClient);
        };

        stompClient.onStompError = (frame) => {
            console.error(`[-] Erro STOMP para usuário ${index}:`, frame.headers['message']);
            resolve(null);
        };

        stompClient.onWebSocketClose = () => {
            resolve(null);
        };

        stompClient.activate();
    });
}

async function simulateConversation(clients) {
    console.log(`\n💬 Iniciando simulação de conversa entre os ${clients.length} usuários...`);
    console.log(`Cada mensagem enviada deve gerar ${clients.length} entregas (Fanout).`);

    let messageCount = 0;
    const interval = setInterval(() => {
        if (clients.length === 0) return;

        const randomIndex = Math.floor(Math.random() * clients.length);
        const client = clients[randomIndex];

        if (client && client.connected) {
            messageCount++;
            const payload = {
                sala_id: 1,
                content: `Mensagem de teste ${messageCount} do usuário ${randomIndex}`
            };

            client.publish({
                destination: '/app/chat.send',
                body: JSON.stringify(payload)
            });
        }

        if (messageCount >= 20) { // Simular 20 mensagens trocadas
            clearInterval(interval);
            setTimeout(() => {
                console.log(`\n📊 Resumo da Conversa:`);
                console.log(`Mensagens enviadas: ${messageCount}`);
                console.log(`Total de recebimentos (esperado): ${messageCount * clients.length}`);
                console.log(`Total de recebimentos (realizado): ${totalMessagesReceived}`);
                process.exit(0);
            }, 5000);
        }
    }, 1000); // 1 mensagem por segundo
}

async function runTest() {
    console.log(`🚀 Iniciando teste de estresse com ${NUM_USERS} usuários...`);
    const startTime = Date.now();
    const clients = [];

    for (let i = 1; i <= NUM_USERS; i++) {
        const token = await registerAndLogin(i);
        if (token) {
            const client = await connectUser(i, token);
            if (client) {
                clients.push(client);
            }
        }

        await new Promise(r => setTimeout(r, CONCURRENCY_DELAY));

        if (i % 50 === 0) {
            console.log(`📊 Progresso: ${i}/${NUM_USERS} usuários conectados...`);
        }
    }

    console.log(`\n✅ ${clients.length} usuários conectados!`);
    await simulateConversation(clients);
}

runTest().catch(console.error);
