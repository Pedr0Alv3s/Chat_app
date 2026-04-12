import React, { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
import {
    IconSearch,
    IconMessage,
    IconUsers,
    IconBell,
    IconCalendar,
    IconChevronRight,
    IconLogOut,
    IconTrend
} from "../../components/Icons";

const userName = "Usuário";

const chats = [
    { id: 1, name: "Equipe de Design", lastMsg: "As mudanças no layout foram aprovadas.", time: "10:30", unread: 2 },
    { id: 2, name: "Marketing", lastMsg: "Carlos: Quando sai o novo post?", time: "Ontem" },
    { id: 3, name: "Desenvolvimento", lastMsg: "Refatoração concluída com sucesso.", time: "14:15" },
    { id: 4, name: "RH / Avisos", lastMsg: "Lembrete: Reunião geral amanhã às 9h.", time: "09:00", unread: 1 },
    { id: 5, name: "Diretoria", lastMsg: "Ata da última reunião disponível.", time: "Seg" },
];

const activities = [
    { id: 1, user: "Ana Lima", action: "mencionou você em", target: "#Design", time: "há 5 min" },
    { id: 2, user: "Carlos Mendes", action: "enviou um arquivo para", target: "Desenvolvimento", time: "há 22 min" },
    { id: 3, user: "Julia Costa", action: "reagiu à sua mensagem em", target: "#Marketing", time: "há 1h" },
];

const meetings = [
    { id: 1, title: "Revisão Q2 — Diretoria", time: "14:00 – 15:00", participants: 6 },
    { id: 2, title: "Stand-up Desenvolvimento", time: "16:00 – 16:15", participants: 4 },
];

const stats = [
    { label: "Mensagens Hoje", value: "24", icon: <IconMessage />, color: "#2563eb" },
    { label: "Grupos Ativos", value: "5", icon: <IconUsers />, color: "#059669" },
    { label: "Não Lidas", value: "3", icon: <IconBell />, color: "#d97706" },
    //{ label: "Reuniões Hoje", value: "2", icon: <IconCalendar />, color: "#7c3aed" },
];

export default function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const filtered = chats.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.lastMsg.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.mainContent}>
                <div className={styles.leftCol}>
                    <div className={styles.topBar}>
                        <div className={styles.greeting}>
                            <span className={styles.greetingText}>Bom dia, <strong>{userName}</strong> 👋</span>
                            <span className={styles.greetingDate}>{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
                        </div>
                        <button className={styles.logoutBtn} onClick={() => navigate("/Login")} title="Sair">
                            <IconLogOut /> Sair
                        </button>
                    </div>
                    <div className={styles.statsRow}>
                        {stats.map(s => (
                            <div key={s.label} className={styles.statCard}>
                                <div className={styles.statIcon} style={{ color: s.color, background: s.color + "18" }}>
                                    {s.icon}
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{s.value}</span>
                                    <span className={styles.statLabel}>{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>Conversas</span>
                            <span className={styles.panelCount}>{chats.length}</span>
                        </div>

                        <div className={styles.searchBar}>
                            <IconSearch />
                            <input
                                className={styles.searchInput}
                                placeholder="Buscar conversas ou pessoas..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className={styles.chatList}>
                            {filtered.map(chat => (
                                <div key={chat.id} className={styles.chatRow} onClick={() => navigate("/Chat")}>
                                    <div className={styles.chatRowAvatar} style={{ background: getAvatarColor(chat.name) }}>
                                        {getInitials(chat.name)}
                                    </div>
                                    <div className={styles.chatRowBody}>
                                        <div className={styles.chatRowTop}>
                                            <span className={styles.chatRowName}>{chat.name}</span>
                                            <span className={styles.chatRowTime}>{chat.time}</span>
                                        </div>
                                        <div className={styles.chatRowBottom}>
                                            <span className={styles.chatRowMsg}>{chat.lastMsg}</span>
                                            {chat.unread && <span className={styles.badge}>{chat.unread}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <p className={styles.emptyMsg}>Nenhuma conversa encontrada.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>Atividade Recente</span>
                            <IconTrend />
                        </div>
                        <div className={styles.activityList}>
                            {activities.map(a => (
                                <div key={a.id} className={styles.activityItem}>
                                    <div className={styles.activityAvatar} style={{ background: getAvatarColor(a.user) }}>
                                        {getInitials(a.user)}
                                    </div>
                                    <div className={styles.activityBody}>
                                        <span className={styles.activityText}>
                                            <strong>{a.user}</strong> {a.action} <em>{a.target}</em>
                                        </span>
                                        <span className={styles.activityTime}>{a.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Reuniões de Hoje</span>
              <IconCalendar />
            </div>
            {meetings.length === 0 ? (
              <p className={styles.emptyMsg}>Sem reuniões agendadas.</p>
            ) : (
              <div className={styles.meetingList}>
                {meetings.map(m => (
                  <div key={m.id} className={styles.meetingItem}>
                    <div className={styles.meetingAccent} />
                    <div className={styles.meetingInfo}>
                      <span className={styles.meetingTitle}>{m.title}</span>
                      <span className={styles.meetingMeta}>{m.time} · {m.participants} participantes</span>
                    </div>
                    <button className={styles.meetingJoin} onClick={() => navigate("/Chat")}>
                      Entrar <IconChevronRight />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          Meetings */}

                </div>
            </div>
        </div>
    );
}