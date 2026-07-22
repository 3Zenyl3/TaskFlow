import "../../../styles/Auth.css"
import AuthLeftSide from "../../components/AuthLayout/AuthLeftSide";
import Input from "../../components/Input/Input";
import React, { useState } from "react";
import LoginButton from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

function Login() {
  const {email, setEmail, password, setPassword, login} = useLogin();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true)
      const response = await login()
      const data = await response.json();
      if (response.ok) {
        setMessage("Вход выполнен");
        setEmail("");
        setPassword("");
        navigate("/dashboard")
      }
      else {
        setMessage(data.error || "Ошибка входа");
      }
    }
    catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
      else {
        setMessage("Неизвестная ошибка");
      }
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <div className="loginWindow">
      <AuthLeftSide></AuthLeftSide>
      <form onSubmit={handleLogin} className="rightSide">
        <div className="registerWindow">
          <h2 className="regTitle">
            Вход
          </h2>
          <p className="regDescription">
            Заполните форму ниже, чтобы войти
          </p>
          <div className="regMenu">
            <h3 className="regMunuTitle">
              Email
            </h3>
            <Input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={setEmail} />
            <h3 className="regMunuTitle">
              Пароль
            </h3>
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={setPassword} />
            <LoginButton
              text={loading ? "Вход" : "Войти"}
              type="submit"
              disabled={loading}
            ></LoginButton>
            <p className="errMessage">{message}</p>
          </div>
        </div>
        <div className="toRegister">
          <p>Нет аккаунта?</p>
          <button type="button" onClick={() => navigate("/register")}>Зарегистрироваться</button>
        </div>
      </form>
    </div>


  );
}

export default Login;