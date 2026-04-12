import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles.module.css";
import { getInitials, getAvatarColor } from "../../utils/avatarUtils";
import { IconHome, IconChat, IconProfile } from "../../components/Icons";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);
    const chatBtnRef = useRef(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);

    const isChat = location.pathname === "/chat";
    const isHome = location.pathname === "/";

    const recents = [
        { id: 1, name: "Equipe de Design", last: "As mudanças no layout..." },
        { id: 2, name: "Marketing", last: "Carlos: Quando sai o novo..." },
        { id: 3, name: "Desenvolvimento", last: "Refatoração concluída..." },
        { id: 4, name: "RH / Avisos", last: "Lembrete: Reunião geral..." },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChatClick = () => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        } else {
            if (chatBtnRef.current) {
                const rect = chatBtnRef.current.getBoundingClientRect();
                setDropdownTop(rect.top);
            }
            setIsDropdownOpen(true);
        }
    };

    const handleSelectChat = (id) => {
        setIsDropdownOpen(false);
        navigate("/chat");
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoArea} onClick={() => navigate("/")} title="Início">
                <div className={styles.logo}>P</div>
            </div>

            <nav className={styles.nav}>
                <button
                    className={`${styles.navItem} ${isHome ? styles.active : ""}`}
                    onClick={() => { navigate("/"); setIsDropdownOpen(false); }}
                    title="Início"
                >
                    <IconHome />
                    <span className={styles.navLabel}>Início</span>
                </button>

                <div style={{ position: "relative" }} ref={dropdownRef}>
                    <button
                        ref={chatBtnRef}
                        className={`${styles.navItem} ${isChat || isDropdownOpen ? styles.active : ""}`}
                        onClick={handleChatClick}
                        title="Mensagens"
                    >
                        <IconChat />
                        <span className={styles.navLabel}>Chat</span>
                    </button>

                    {isDropdownOpen && (
                        <div className={styles.dropdownContainer} style={{ top: dropdownTop }}>
                            <div className={styles.dropdownHeader}>Conversas Recentes</div>
                            <div className={styles.dropdownContent}>
                                {recents.map(chat => (
                                    <button key={chat.id} className={styles.dropdownItem} onClick={() => handleSelectChat(chat.id)}>
                                        <div className={styles.itemAvatar} style={{ background: getAvatarColor(chat.name) }}>
                                            {getInitials(chat.name)}
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{chat.name}</span>
                                            <span className={styles.itemMsg}>{chat.last}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className={`${styles.navItem} ${location.pathname === "/perfil" ? styles.active : ""}`}
                    onClick={() => { navigate("/perfil"); setIsDropdownOpen(false); }}
                    title="Perfil"
                >
                    <IconProfile />
                    <span className={styles.navLabel}>Perfil</span>
                </button>
            </nav>

            <div className={styles.userProfile}>
                <div
                    className={styles.avatar}
                    style={{ backgroundColor: "#2563eb" }}
                    title="Seu perfil"
                >
                    V
                </div>
            </div>
        </header>
    );
}

export default Header;
