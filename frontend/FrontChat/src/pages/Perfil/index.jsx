import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Header from "../../components/Header";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
import { authService } from "../../services/api";
import {
    IconUsers,
    IconBell,
    IconLogOut,
    IconProfile,
} from "../../components/Icons";

function StatBadge({ label, value, color }) {
    return (
        <div className={styles.statBadge}>
            <span className={styles.statBadgeValue} style={{ color }}>{value}</span>
            <span className={styles.statBadgeLabel}>{label}</span>
        </div>
    );
}

function InfoRow({ label, value, name, isEditing, onChange, editable }) {
    return (
        <div className={styles.infoRow}>
            <div style={{ flex: 1 }}>
                <span className={styles.infoLabel}>{label}</span>
                {isEditing && editable ? (
                    <input
                        name={name}
                        className={styles.profileInput}
                        value={value || ""}
                        onChange={onChange}
                    />
                ) : (
                    <span className={styles.infoValue}>{value || "Não informado"}</span>
                )}
            </div>
        </div>
    );
}

function Toggle({ label, checked }) {
    const [on, setOn] = useState(checked);
    return (
        <div className={styles.toggleRow}>
            <span className={styles.infoValue}>{label}</span>
            <button
                className={`${styles.toggle} ${on ? styles.toggleOn : ""}`}
                onClick={() => setOn(v => !v)}
                aria-label={label}
            >
                <span className={styles.toggleKnob} />
            </button>
        </div>
    );
}

export default function Perfil() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await authService.getProfile();
                setProfile(data);
                setFormData(data);
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updated = await authService.updateProfile(formData);
            setProfile(updated);
            setIsEditing(false);
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao atualizar perfil.");
        }
    };

    if (loading || !profile) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.mainContent}>Carregando...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.mainContent}>
                <section className={styles.hero}>
                    <div className={styles.heroBanner} />
                    <div className={styles.heroBody}>
                        <div
                            className={styles.avatarLarge}
                            style={{ backgroundColor: getAvatarColor(profile.name) }}
                        >
                            {getInitials(profile.name)}
                        </div>
                        <div className={styles.heroInfo}>
                            <h1 className={styles.userName}>{profile.name}</h1>
                            <p className={styles.userRole}>{profile.role || "Cargo não definido"}</p>
                            <div className={styles.heroMeta}>
                                <span className={styles.onlineDot} />
                                <span className={styles.onlineLabel}>Online agora</span>
                                <span className={styles.heroDivider}>·</span>
                                <span className={styles.userEmail}>{profile.email}</span>
                            </div>
                        </div>
                        <div className={styles.heroStats}>
                            <StatBadge label="Mensagens" value={profile.messagesCount} color="var(--corp-accent)" />
                            <StatBadge label="Grupos" value={profile.roomsCount} color="#059669" />
                        </div>
                    </div>
                </section>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon} style={{ background: "#eff6ff" }}>
                                <IconProfile size={17} />
                            </div>
                            <h2 className={styles.cardTitle}>Dados Pessoais</h2>
                        </div>
                        <div className={styles.infoList}>
                            <InfoRow 
                                label="Nome Completo" 
                                value={isEditing ? formData.name : profile.name} 
                                name="name"
                                editable
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                            <InfoRow 
                                label="E-mail Corporativo" 
                                value={isEditing ? formData.email : profile.email} 
                                name="email"
                                editable
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                            <InfoRow 
                                label="Telefone" 
                                value={isEditing ? formData.phone : profile.phone} 
                                name="phone"
                                editable
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon} style={{ background: "#f0fdf4" }}>
                                <IconProfile size={17} />
                            </div>
                            <h2 className={styles.cardTitle}>Profissional</h2>
                        </div>
                        <div className={styles.infoList}>
                             <InfoRow 
                                label="Cargo" 
                                value={isEditing ? formData.role : profile.role} 
                                name="role"
                                editable
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                            <InfoRow 
                                label="Departamento" 
                                value={isEditing ? formData.department : profile.department} 
                                name="department"
                                editable
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon} style={{ background: "#fff7ed" }}>
                                <IconBell size={17} />
                            </div>
                            <h2 className={styles.cardTitle}>Preferências</h2>
                        </div>
                        <div className={styles.infoList}>
                            <Toggle label="Notificações Desktop" checked={true} />
                            <Toggle label="Sons de Mensagem" checked={true} />
                        </div>
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <div className={styles.actionGroup}>
                        {isEditing ? (
                            <>
                                <button className={styles.saveBtn} onClick={handleSave}>Salvar Alterações</button>
                                <button className={styles.cancelBtn} onClick={() => {
                                    setIsEditing(false);
                                    setFormData(profile);
                                }}>Cancelar</button>
                            </>
                        ) : (
                            <button className={styles.saveBtn} onClick={() => setIsEditing(true)}>Editar Perfil</button>
                        )}
                    </div>
                    
                    <button
                        className={styles.logoutBtn}
                        onClick={() => authService.logout()}
                    >
                        <IconLogOut size={15} />
                        Encerrar Sessão
                    </button>
                </div>

            </main>
        </div>
    );
}
