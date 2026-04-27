import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { IconMail, IconLock, IconProfile } from "../../components/Icons";
import Toast from "../../components/Toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cadEmail, setCadEmail] = useState("");
  const [cadPassword, setCadPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [temConta, setTemConta] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      try {
        await authService.login(email, password);
        showToast("Login realizado com sucesso! Bem-vindo de volta.", "success");
        
        // Inicia animação de saída
        setTimeout(() => setIsNavigating(true), 800);
        setTimeout(() => navigate("/home"), 1600);
      } catch (error) {
        showToast(error.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais.", "error");
      }
    } else {
      showToast("Preencha todos os campos corretamente", "error");
    }
  };

  const handleCadastro = async () => {
    if (name && cadEmail && cadPassword && confPassword) {
      if (cadPassword !== confPassword) {
        showToast("As senhas não coincidem", "error");
      } else {
        try {
          await authService.register(name, cadEmail, cadPassword);
          showToast("Cadastro realizado com sucesso! Faça login para continuar.", "success");
          setTimeout(() => setTemConta(true), 2000);
        } catch (error) {
          showToast(error.response?.data?.message || "Erro ao realizar cadastro.", "error");
        }
      }
    } else {
      showToast("Preencha todos os campos corretamente", "error");
    }
  };

  return (
    <div className={`${styles.pageWrapper} ${isNavigating ? styles.isNavigating : ""}`} onMouseMove={handleMouseMove}>
      <div className={styles.meshContainer}>
        <div className={`${styles.blob} ${styles.blob1}`} style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }} />
        <div className={`${styles.blob} ${styles.blob2}`} style={{ transform: `translate(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px)` }} />
        <div className={`${styles.blob} ${styles.blob3}`} style={{ transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 0.2}px)` }} />
        <div className={styles.noiseOverlay} />
      </div>

      {toast.show && (
        <Toast
          key={toast.message + toast.type} /* Key única para resetar o componente */
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      <div className={styles.container}>
        <h1 className={styles.title}>{temConta ? "Bem-vindo" : "Criar Conta"}</h1>

        {temConta ? (
          <div className={styles.loginInputs}>
            <div className={styles.inputGroup}>
              <IconMail />
              <input
                className={styles.input}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <IconLock />
              <input
                className={styles.input}
                placeholder="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={styles.submitBtn} onClick={handleLogin}>Entrar</button>
            <p className={styles.footerText}>
              Não possui conta?
              <button className={styles.toggleBtn} onClick={() => setTemConta(false)}>Cadastre-se</button>
            </p>
          </div>
        ) : (
          <div className={styles.loginInputs}>
            <div className={styles.inputGroup}>
              <IconProfile />
              <input
                className={styles.input}
                placeholder="Nome Completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <IconMail />
              <input
                className={styles.input}
                placeholder="Email"
                type="email"
                value={cadEmail}
                onChange={(e) => setCadEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <IconLock />
              <input
                className={styles.input}
                placeholder="Senha"
                type="password"
                value={cadPassword}
                onChange={(e) => setCadPassword(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <IconLock />
              <input
                className={styles.input}
                placeholder="Confirmar Senha"
                type="password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </div>
            <button className={styles.submitBtn} onClick={handleCadastro}>Cadastrar</button>
            <p className={styles.footerText}>
              Já possui conta?
              <button className={styles.toggleBtn} onClick={() => setTemConta(true)}>Fazer Login</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
