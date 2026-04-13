import React from "react";
import styles from "../Login/styles.module.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [cadEmail, setCadEmail] = React.useState("");
  const [cadPassword, setCadPassword] = React.useState("");
  const [confPassword, setConfPassword] = React.useState("");
  const [temConta, setTemConta] = React.useState(true);
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
    <>
      {temConta ?
        <div className={styles.container}>
          <h1>Login</h1>
          <div className={styles.loginInputs}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => handleLogin()}>Login</button>
            <span>não possui conta? <button onClick={() => setTemConta(false)}>Cadastre-se</button></span>
          </div>
        </div>
        : null}
      {temConta ? null :
        <div className={styles.container}>
          <h1>Cadastro de Usuário</h1>
          <div className={styles.loginInputs}>
            <input
              placeholder="Nome Completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              type="email"
              value={cadEmail}
              onChange={(e) => setCadEmail(e.target.value)}
            />
            <input
              placeholder="Senha"
              type="password"
              value={cadPassword}
              onChange={(e) => setCadPassword(e.target.value)}
            />
            <input
              placeholder="Confirmar Senha"
              type="password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
            />
            <button onClick={() => handleCadastro()}>Cadastrar</button>
            <span>já possui conta? <button onClick={() => setTemConta(true)}>Login</button></span>
          </div>
        </div>
      }

    </>
  );
}
export default Login;
