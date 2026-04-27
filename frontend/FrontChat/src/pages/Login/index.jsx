import React, { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { IconMail, IconLock, IconProfile } from "../../components/Icons";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cadEmail, setCadEmail] = useState("");
  const [cadPassword, setCadPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [temConta, setTemConta] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        await authService.login(email, password);
        navigate("/home");
      } catch (error) {
        alert(error.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais.");
      }
    } else {
      alert("Preencha todos os campos corretamente");
    }
  };

  const handleCadastro = async () => {
    if (name && cadEmail && cadPassword && confPassword) {
      if (cadPassword !== confPassword) {
        alert("As senhas não coincidem");
      } else {
        try {
          await authService.register(name, cadEmail, cadPassword);
          alert("Cadastro realizado com sucesso! Faça login para continuar.");
          setTemConta(true);
        } catch (error) {
          alert(error.response?.data?.message || "Erro ao realizar cadastro.");
        }
      }
    } else {
      alert("Preencha todos os campos corretamente");
    }
  };

  return (
    <div className={styles.pageWrapper}>
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
