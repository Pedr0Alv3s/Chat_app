import React from "react";
import styles from "../Login/styles.module.css";
import { useNavigate } from "react-router-dom";
function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [cadUsername, setCadUsername] = React.useState("");
  const [cadPassword, setCadPassword] = React.useState("");
  const [confPassword, setConfPassword] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // console.log("Username:", username);
    // console.log("Password:", password);
    if (username && password) {
      console.log("redirecionando para home");
      navigate("/");
    } else {
      console.log("preencha todos os campos corretamente");
    }
  };

  const handleCadastro = () => {
    // console.log("Username:", cadUsername);
    // console.log("Password:", cadPassword);
    // console.log("Confirm Password:", confPassword);
    if (cadUsername && cadPassword && confPassword) {
      if (cadPassword !== confPassword) {
        console.log("senhas não coinsidem");
      } else {
        console.log("redirecionando para home");
        navigate("/");
      }
    } else {
      console.log("preencha todos os campos corretamente");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Login</h1>
        <div className={styles.loginInputs}>
          <input
            placeholder="Usuário"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => handleLogin()}>Login</button>
        </div>
      </div>

      <div className={styles.container}>
        <h1>Cadastro de Usuário</h1>
        <div className={styles.loginInputs}>
          <input
            placeholder="Usuário"
            type="text"
            value={cadUsername}
            onChange={(e) => setCadUsername(e.target.value)}
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
        </div>
      </div>
    </>
  );
}
export default Login;
