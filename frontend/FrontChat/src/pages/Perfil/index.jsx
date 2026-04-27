import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
import { authService } from "../../services/api";
import Toast from "../../components/Toast";
import {
    IconUsers,
    IconBell,
    IconLogOut,
    IconProfile,
    IconShieldCheck,
    IconSettings,
    IconCheck
} from "../../components/Icons";

function StatBadge({ label, value, color }) {
    return (
        <div className={styles.statBadge}>
            <span className={styles.statBadgeLabel}>{label}</span>
            <span className={styles.statBadgeValue} style={{ color }}>{value}</span>
        </div>
    );
}

export default function Perfil() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const showToast = (message, type = "info") => {
        setToast({ show: true, message, type });
    };

    const closeToast = useCallback(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, []);

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
        if (token) {
            fetchProfile();
        } else {
            navigate("/login");
            setLoading(false);
        }
    }, [token, navigate]);

    const handleLogout = () => {
        showToast("Sessão encerrada com sucesso. Até logo!", "success");
        setTimeout(() => setIsNavigating(true), 1600);
        setTimeout(() => {
            authService.logout();
            navigate("/login");
        }, 2400);
    };

    const handlePageTransition = (path) => {
        setIsNavigating(true);
        setTimeout(() => navigate(path), 600);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updated = await authService.updateProfile(formData);
            setProfile(updated);
            setIsEditing(false);
            showToast("Perfil atualizado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            showToast("Erro ao atualizar perfil.", "error");
        }
    };

    if (loading || !profile) {
        return (
            <div className={`${styles.container} animate-page-in`}>
                <Header onNavigate={handlePageTransition} />
                <div className={styles.mainContent}>Carregando...</div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} animate-page-in ${isNavigating ? styles.isNavigating : ""}`}>
            <Header onNavigate={handlePageTransition} />

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
                            <p className={styles.userRole}>{profile.role || "Membro Platinum"}</p>
                            <div className={styles.heroMeta}>
                                <span className={styles.onlineDot} />
                                <span className={styles.onlineLabel}>Online agora</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={styles.profileGrid}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <IconProfile size={20} /> Informações Pessoais
                        </h2>
                        
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nome Completo</label>
                                <input
                                    className={styles.input}
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Endereço de E-mail</label>
                                <input
                                    className={styles.input}
                                    name="email"
                                    value={formData.email || ""}
                                    disabled={true} // Email geralmente não se edita assim
                                />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Bio / Descrição</label>
                                <input
                                    className={styles.input}
                                    placeholder="Conte um pouco sobre você..."
                                    name="bio"
                                    value={formData.bio || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className={styles.actions}>
                            {isEditing ? (
                                <>
                                    <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => {
                                        setIsEditing(false);
                                        setFormData(profile);
                                    }}>Cancelar</button>
                                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>
                                        <IconCheck size={18} /> Salvar Alterações
                                    </button>
                                </>
                            ) : (
                                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsEditing(true)}>
                                    <IconSettings size={18} /> Editar Perfil
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.infoBadges}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <IconShieldCheck size={20} /> Segurança
                            </h2>
                            <div className={styles.statusCard}>
                                <IconShieldCheck size={18} /> Conta Verificada
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <StatBadge label="Sessão" value="Ativa" color="#4ade80" />
                                <StatBadge label="MFA" value="Desativado" color="#f87171" />
                            </div>
                        </div>

                        <button
                            className={`${styles.btn} ${styles.logoutBtn}`}
                            onClick={handleLogout}
                        >
                            <IconLogOut size={18} /> Encerrar Sessão
                        </button>
                    </div>
                </div>
            </main>

            {toast.show && (
                <Toast
                    key={toast.message + toast.type}
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
        </div>
    );
}
