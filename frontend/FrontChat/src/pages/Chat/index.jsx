import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";
import Header from "../../components/Header";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
import chatService from "../../services/chatService";
import webSocketService from "../../services/websocketService";
import {
    IconHash,
    IconSearch,
    IconSend,
    IconAttach,
    IconEmoji,
    IconUsers,
    IconBell
} from "../../components/Icons";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [roomName, setRoomName] = useState("geral");
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const messageEndRef = useRef(null);

    const { salaId } = useParams();
    const currentSalaId = salaId || 1; 
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // 1. Carregar Dados Iniciais (Histórico)
    useEffect(() => {
        const loadRoomData = async () => {
            try {
                setLoading(true);
                const data = await chatService.accessRoom(currentSalaId);
                
                // Mapear mensagens do backend para o formato do frontend
                const history = data.mensagem.map(m => ({
                    id: m.id,
                    user: m.creator_name,
                    text: m.content,
                    timestamp: new Date(m.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })).reverse(); // Ordenar para que a última msg fique no final

                setMessages(history);
                setRoomName(data.sala_name);
                
                // Mapear participantes
                const participants = data.participantes.map(p => ({
                    id: p.client_id,
                    name: p.name,
                    role: "Membro", // Pode ser estático por enquanto
                    status: "online"
                }));
                setMembers(participants);

            } catch (error) {
                console.error("Erro ao carregar sala:", error);
                alert(`Erro ao carregar sala. Verifique se a sala ID ${currentSalaId} existe.`);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadRoomData();
        }
    }, [currentSalaId, token]);

    // 2. Conectar WebSocket e Inscrever
    useEffect(() => {
        if (!token) return;

        const onMessageReceived = (msg) => {
            const newMsg = {
                id: msg.id,
                user: msg.creator_name,
                text: msg.content,
                timestamp: new Date(msg.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMsg]);
        };

        const onConnected = () => {
            webSocketService.subscribe(`/topic/rooms/${currentSalaId}`, onMessageReceived);
        };

        webSocketService.connect(token, onConnected);

        return () => {
            webSocketService.unsubscribe(`/topic/rooms/${currentSalaId}`);
            // webSocketService.disconnect(); // Opcional: manter conectado entre páginas
        };
    }, [currentSalaId, token]);

    // Role para baixo ao receber mensagens
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Enviar via WebSocket (STOMP)
        const payload = {
            sala_id: Number(currentSalaId),
            content: inputText
        };

        console.log("Enviando via WebSocket para /app/chat.send:", payload);
        webSocketService.send("/app/chat.send", payload);
        setInputText("");
    };

    const statusLabel = { online: "Online", away: "Ausente", busy: "Ocupado" };

    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loadingArea}>
                    <p>Carregando chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.contentWrapper}>
                <main className={styles.chatMain}>
                    <header className={styles.chatHeader}>
                        <div className={styles.chatHeaderLeft}>
                            <IconHash />
                            <span className={styles.chatHeaderTitle}>{roomName}</span>
                            <span className={styles.chatHeaderSub}>· Canal de comunicação em tempo real</span>
                        </div>
                        <div className={styles.chatHeaderActions}>
                            <button className={styles.headerActionBtn} title="Membros"><IconUsers /></button>
                            <button className={styles.headerActionBtn} title="Buscar"><IconSearch /></button>
                            <button className={styles.headerActionBtn} title="Notificações"><IconBell /></button>
                        </div>
                    </header>

                    <section className={styles.messageList}>
                        <div className={styles.dateDivider}>Histórico de Mensagens</div>

                        {messages.length === 0 ? (
                            <p className={styles.emptyMsg}>Nenhuma mensagem nesta sala. Seja o primeiro a falar!</p>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className={styles.message}>
                                    <div
                                        className={styles.avatar}
                                        style={{ backgroundColor: getAvatarColor(msg.user) }}
                                        title={msg.user}
                                    >
                                        {getInitials(msg.user)}
                                    </div>
                                    <div className={styles.messageContent}>
                                        <div className={styles.messageUser}>
                                            <span className={styles.userName}>{msg.user}</span>
                                            <span className={styles.timestamp}>{msg.timestamp}</span>
                                        </div>
                                        <div className={styles.text}>{msg.text}</div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messageEndRef} />
                    </section>

                    <form className={styles.inputArea} onSubmit={handleSendMessage}>
                        <div className={styles.inputWrapper}>
                            <button type="button" className={styles.inputActionBtn} title="Anexar arquivo">
                                <IconAttach />
                            </button>
                            <input
                                className={styles.chatInput}
                                placeholder={`Enviar mensagem para #${roomName}`}
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                aria-label="Campo de mensagem"
                            />
                            <button type="button" className={styles.inputActionBtn} title="Emojis">
                                <IconEmoji />
                            </button>
                            <button type="submit" className={styles.sendBtn} title="Enviar">
                                <IconSend />
                            </button>
                        </div>
                    </form>
                </main>
                <aside className={styles.memberList}>
                    <div className={styles.memberListHeader}>
                        <IconUsers />&nbsp; Membros ({members.length})
                    </div>
                    <div className={styles.memberCategory}>
                        Equipe da Sala — {members.length}
                    </div>
                    {members.map(member => (
                        <div key={member.id} className={styles.memberItem}>
                            <div
                                className={styles.memberAvatarWrap}
                                style={{ backgroundColor: getAvatarColor(member.name) }}
                            >
                                {getInitials(member.name)}
                                <span className={`${styles.statusIndicator} ${styles[member.status]}`} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div className={styles.memberItemName}>{member.name}</div>
                                <div className={styles.memberItemRole}>{member.role}</div>
                            </div>
                        </div>
                    ))}
                </aside>
            </div>
        </div>
    );
}

export default Chat;