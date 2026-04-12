import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import Header from "../../components/Header";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
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
    const [messages, setMessages] = useState([
        { id: 1, user: "Márcio Silva", text: "Bom dia a todos! Alguém revisou o relatório Q1?", timestamp: "09:14" },
        { id: 2, user: "Ana Lima", text: "Sim, revisei. Tem alguns pontos para discutirmos antes da reunião das 14h.", timestamp: "09:17" },
        { id: 3, user: "Carlos Mendes", text: "Ótimo. Já coloquei os comentários no documento compartilhado.", timestamp: "09:22" },
        { id: 4, user: "Márcio Silva", text: "Perfeito, obrigado! Vou checar antes da call.", timestamp: "09:25" },
    ]);
    const [inputText, setInputText] = useState("");
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        setMessages(prev => [
            ...prev,
            { id: Date.now(), user: "Você", text: inputText, timestamp: "Agora" }
        ]);
        setInputText("");
    };

    const members = [
        { id: 1, name: "Márcio Silva", role: "Gerente de Projeto", status: "online" },
        { id: 2, name: "Ana Lima", role: "Analista Sênior", status: "online" },
        { id: 3, name: "Carlos Mendes", role: "Desenvolvedor", status: "away" },
        { id: 4, name: "Julia Costa", role: "Designer UX", status: "busy" },
    ];

    const statusLabel = { online: "Online", away: "Ausente", busy: "Ocupado" };

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.contentWrapper}>
                <main className={styles.chatMain}>
                    <header className={styles.chatHeader}>
                        <div className={styles.chatHeaderLeft}>
                            <IconHash />
                            <span className={styles.chatHeaderTitle}>geral</span>
                            <span className={styles.chatHeaderSub}>· Canal geral do projeto</span>
                        </div>
                        <div className={styles.chatHeaderActions}>
                            <button className={styles.headerActionBtn} title="Membros"><IconUsers /></button>
                            <button className={styles.headerActionBtn} title="Buscar"><IconSearch /></button>
                            <button className={styles.headerActionBtn} title="Notificações"><IconBell /></button>
                        </div>
                    </header>

                    <section className={styles.messageList}>
                        <div className={styles.dateDivider}>Hoje</div>

                        {messages.map(msg => (
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
                        ))}
                        <div ref={messageEndRef} />
                    </section>

                    <form className={styles.inputArea} onSubmit={handleSendMessage}>
                        <div className={styles.inputWrapper}>
                            <button type="button" className={styles.inputActionBtn} title="Anexar arquivo">
                                <IconAttach />
                            </button>
                            <input
                                className={styles.chatInput}
                                placeholder="Escreva uma mensagem para #geral"
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
                        Online — {members.filter(m => m.status === "online").length}
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
                                <div className={styles.memberItemRole}>{statusLabel[member.status]}</div>
                            </div>
                        </div>
                    ))}
                </aside>

            </div>
        </div>
    );
}

export default Chat;