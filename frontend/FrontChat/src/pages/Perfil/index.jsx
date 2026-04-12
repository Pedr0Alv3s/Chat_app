import React, { useState } from "react";
import styles from "./styles.module.css";
import Header from "../../components/Header";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
import {
    IconUsers,
    IconBell,
    IconLogOut,
    IconProfile,
    IconMessage
} from "../../components/Icons";

const userName = "Usuario";
const userRole = "Gerente de Projetos Sênior";
const userEmail = "[EMAIL_ADDRESS]";
const userDept = "Operações & Estratégia";
const userPhone = "+55 (11) 98765-4321";

function StatBadge({ label, value, color }) {
    return (
        <div className={styles.statBadge}>
            <span className={styles.statBadgeValue} style={{ color }}>{value}</span>
            <span className={styles.statBadgeLabel}>{label}</span>
        </div>
    );
}

function InfoRow({ label, value, editable }) {
    return (
        <div className={styles.infoRow}>
            <div>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value}</span>
            </div>
            {editable && <button className={styles.editLink}>Editar</button>}
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
    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.mainContent}>

                {/* ── Hero ── */}
                <section className={styles.hero}>
                    <div className={styles.heroBanner} />
                    <div className={styles.heroBody}>
                        <div
                            className={styles.avatarLarge}
                            style={{ backgroundColor: getAvatarColor(userName) }}
                        >
                            {getInitials(userName)}
                        </div>
                        <div className={styles.heroInfo}>
                            <h1 className={styles.userName}>{userName}</h1>
                            <p className={styles.userRole}>{userRole}</p>
                            <div className={styles.heroMeta}>
                                <span className={styles.onlineDot} />
                                <span className={styles.onlineLabel}>Online agora</span>
                                <span className={styles.heroDivider}>·</span>
                                <span className={styles.userEmail}>{userEmail}</span>
                            </div>
                        </div>
                        <div className={styles.heroStats}>
                            <StatBadge label="Mensagens" value="1.4k" color="var(--corp-accent)" />
                            <StatBadge label="Grupos" value="5" color="#059669" />
                            <StatBadge label="Projetos" value="12" color="#7c3aed" />
                        </div>
                    </div>
                </section>

                {/* ── Cards ── */}
                <div className={styles.grid}>

                    {/* Dados Pessoais */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon} style={{ background: "#eff6ff" }}>
                                <IconProfile size={17} />
                            </div>
                            <h2 className={styles.cardTitle}>Dados Pessoais</h2>
                        </div>
                        <div className={styles.infoList}>
                            <InfoRow label="E-mail Corporativo" value={userEmail} editable />
                            <InfoRow label="Telefone" value={userPhone} editable />
                            <InfoRow label="Departamento" value={userDept} />
                        </div>
                    </div>

                    {/* Segurança */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon} style={{ background: "#f0fdf4" }}>
                                <IconUsers size={17} />
                            </div>
                            <h2 className={styles.cardTitle}>Segurança</h2>
                        </div>
                        <div className={styles.infoList}>
                            <InfoRow label="Senha" value="Alterada há 3 meses" editable />
                            <div className={styles.toggleRow}>
                                <span className={styles.infoValue}>Autenticação 2FA</span>
                                <span className={styles.statusPill}>✓ Ativo</span>
                            </div>
                            <div className={styles.toggleRow}>
                                <span className={styles.infoValue}>Alertas de login</span>
                                <span className={styles.statusPill}>✓ Ativo</span>
                            </div>
                        </div>
                    </div>

                    {/* Preferências */}
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
                            <Toggle label="Modo Escuro Automático" checked={false} />
                            <InfoRow label="Fuso Horário" value="(GMT-03:00) Brasília" />
                        </div>
                    </div>

                </div>

                {/* ── Footer Actions ── */}
                <div className={styles.footerActions}>
                    <button
                        className={styles.logoutBtn}
                        onClick={() => window.location.href = "/login"}
                    >
                        <IconLogOut size={15} />
                        Encerrar Sessão
                    </button>
                </div>

            </main>
        </div>
    );
}
