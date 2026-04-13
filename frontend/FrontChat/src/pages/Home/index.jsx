import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
import { authService } from "../../services/api";
import chatService from "../../services/chatService";
import {
    IconSearch,
    IconMessage,
    IconUsers,
    IconBell,
    IconLogOut,
    IconTrend,
    IconPlus
} from "../../components/Icons";

export default function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");

    // Recuperar usuário do localStorage
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = savedUser.name || "Usuário";
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const data = await chatService.getRooms();
                setRooms(data);
            } catch (error) {
                console.error("Erro ao buscar salas:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRooms();
        }
    }, [token]);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!newRoomName.trim()) return;

        try {
            const newRoom = await chatService.createRoom(newRoomName);
            setRooms(prev => [...prev, newRoom]);
            setNewRoomName("");
            setIsModalOpen(false);
            // Navegar direto para a nova sala
            navigate(`/chat/${newRoom.id}`);
        } catch (error) {
            console.error("Erro ao criar sala:", error);
            alert("Erro ao criar sala. Tente novamente.");
        }
    };

    const filteredRooms = rooms.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: "Mensagens Hoje", value: "0", icon: <IconMessage />, color: "#2563eb" },
        { label: "Grupos Ativos", value: rooms.length.toString(), icon: <IconUsers />, color: "#059669" },
        { label: "Não Lidas", value: "0", icon: <IconBell />, color: "#d97706" },
    ];

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
                        <button className={styles.logoutBtn} onClick={() => authService.logout()} title="Sair">
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
                            <div className={styles.panelTitleGroup}>
                                <span className={styles.panelTitle}>Suas Conversas</span>
                                <span className={styles.panelCount}>{rooms.length}</span>
                            </div>
                            <button className={styles.createRoomBtn} onClick={() => setIsModalOpen(true)}>
                                <IconPlus /> Nova Sala
                            </button>
                        </div>

                        <div className={styles.searchBar}>
                            <IconSearch />
                            <input
                                className={styles.searchInput}
                                placeholder="Buscar salas..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className={styles.chatList}>
                            {loading ? (
                                <p className={styles.emptyMsg}>Carregando salas...</p>
                            ) : filteredRooms.length === 0 ? (
                                <p className={styles.emptyMsg}>Nenhuma sala encontrada. Crie uma nova para começar!</p>
                            ) : (
                                filteredRooms.map(room => (
                                    <div key={room.id} className={styles.chatRow} onClick={() => navigate(`/chat/${room.id}`)}>
                                        <div className={styles.chatRowAvatar} style={{ background: getAvatarColor(room.name) }}>
                                            {getInitials(room.name)}
                                        </div>
                                        <div className={styles.chatRowBody}>
                                            <div className={styles.chatRowTop}>
                                                <span className={styles.chatRowName}>{room.name}</span>
                                                <span className={styles.chatRowTime}>Sala ID: {room.id}</span>
                                            </div>
                                            <div className={styles.chatRowBottom}>
                                                <span className={styles.chatRowMsg}>Clique para entrar na conversa</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>Início Rápido</span>
                            <IconTrend />
                        </div>
                        <div className={styles.quickStartArea}>
                            <p>Bem-vindo ao ChatApp Corporativo. Aqui você pode gerenciar suas salas e comunicações.</p>
                            <ul className={styles.tipsList}>
                                <li>Use salas para organizar projetos.</li>
                                <li>Convide membros usando o nome de usuário.</li>
                                <li>Mensagens são atualizadas em tempo real.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Criação de Sala */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Criar Nova Sala</h2>
                        <p className={styles.modalSub}>Dê um nome claro para o seu grupo de trabalho.</p>
                        <form onSubmit={handleCreateRoom}>
                            <div className={styles.formGroup}>
                                <label>Nome da Sala</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Equipe de Vendas, Projeto Alpha..."
                                    value={newRoomName}
                                    onChange={e => setNewRoomName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className={styles.submitBtn}>Criar Sala</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}