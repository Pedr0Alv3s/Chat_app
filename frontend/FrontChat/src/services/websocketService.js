import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map(); // Armazena { topic: { subscription, callback } }
    }

    connect(token, onConnectCallback) {
        if (this.client && this.client.connected) {
            if (onConnectCallback) onConnectCallback();
            return;
        }
        
        if (this.client && this.client.active) {
            return;
        }

        const socketUrl = `http://localhost:8080/ws?token=${token}`;
        
        this.client = new Client({
            brokerURL: `ws://localhost:8080/ws?token=${token}`,
            reconnectDelay: 3000, // Tenta reconectar a cada 3 segundos em caso de queda
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log('STOMP:', str),
        });

        this.client.webSocketFactory = () => {
            return new SockJS(socketUrl);
        };

        this.client.onConnect = (frame) => {
            console.log('>>> WebSocket Conectado (ou Reconectado)');
            
            // Lógica de Ouro: Reinscreve automaticamente em todos os tópicos ativos
            this.subscriptions.forEach((subData, topic) => {
                console.log(`>>> Reinscrevendo automaticamente no tópico: ${topic}`);
                const newSub = this.client.subscribe(topic, (message) => {
                    subData.callback(JSON.parse(message.body));
                });
                // Atualiza a referência da subscrição, mantendo o mesmo callback
                this.subscriptions.set(topic, { subscription: newSub, callback: subData.callback });
            });

            if (onConnectCallback) onConnectCallback(frame);
        };

        this.client.onDisconnect = () => {
            console.warn('>>> WebSocket Desconectado. Tentando reconectar via NGINX...');
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error', frame.headers['message']);
        };

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (this.subscriptions.has(topic)) {
            return;
        }

        // Se estiver conectado, se inscreve na hora. 
        // Se não, o onConnect cuidará disso quando a conexão subir.
        let subscription = null;
        if (this.client && this.client.connected) {
            subscription = this.client.subscribe(topic, (message) => {
                callback(JSON.parse(message.body));
            });
        }
        
        // Guardamos o tópico e o callback para caso de reconexão
        this.subscriptions.set(topic, { subscription, callback });
    }

    unsubscribe(topic) {
        const subData = this.subscriptions.get(topic);
        if (subData && subData.subscription) {
            subData.subscription.unsubscribe();
        }
        this.subscriptions.delete(topic);
    }

    send(destination, payload) {
        if (!this.client || !this.client.connected) {
            console.error('Não é possível enviar: WebSocket não conectado');
            return;
        }

        this.client.publish({
            destination,
            body: JSON.stringify(payload),
        });
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.subscriptions.clear();
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
