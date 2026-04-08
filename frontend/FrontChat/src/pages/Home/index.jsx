import React from "react";
import styles from "../Home/styles.module.css";
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();
    const handleSair = () => {
        console.log("saindo da conta");
        navigate("/Login");

    };
    return (
        <div className={styles.container}>
            <button className={styles.sairButton} onClick={() => handleSair()}>Sair</button>
            <div className={styles.content}>
                <div className={styles.users}>
                    <h2>Usuarios online</h2>
                </div>
                <div className={styles.chat}>
                    <h2>Chats</h2>
                </div>
            </div>
        </div>
    );
}
export default Home;