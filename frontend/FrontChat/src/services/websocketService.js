import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(token, onConnectCallback) {
        if (this.client && this.client.connected) {
            if (onConnectCallback) onConnectCallback();
            return;
        }
        
        if (this.client && this.client.active) {
            // Se já estiver no processo de conexão (ex: StrictMode chamou duas vezes),
            // anexamos o callback para não perder a inscrição.
            const previousCallback = this.client.onConnect;
            this.client.onConnect = (frame) => {
                if (previousCallback) previousCallback(frame);
                if (onConnectCallback) onConnectCallback();
            };
            return;
        }

        // O backend espera o token na query string conforme o WebSocketAuthInterceptor.java
        const socketUrl = `http://localhost:8080/ws?token=${token}`;
        
        this.client = new Client({
            brokerURL: `ws://localhost:8080/ws?token=${token}`, // Para ambientes sem SockJS
            connectHeaders: {},
            debug: (str) => console.log('STOMP:', str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // Caso o brokerURL falhe (ex: proxy), podemos usar webSocketFactory com SockJS
        this.client.webSocketFactory = () => {
            return new SockJS(socketUrl);
        };

        this.client.onConnect = (frame) => {
            console.log('Connected to WebSocket');
            if (onConnectCallback) onConnectCallback(frame);
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error', frame.headers['message']);
            console.error('Details:', frame.body);
        };

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (!this.client || !this.client.connected) {
            console.error('Cannot subscribe: not connected');
            return;
        }

        const subscription = this.client.subscribe(topic, (message) => {
            callback(JSON.parse(message.body));
        });
        
        this.subscriptions.set(topic, subscription);
        return subscription;
    }

    unsubscribe(topic) {
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    send(destination, payload) {
        if (!this.client || !this.client.connected) {
            console.error('Cannot send: not connected');
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
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
