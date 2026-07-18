import "./Login.css"
import AuthLeftSide from "../../components/AuthLayout/AuthLeftSide";
import Input from "../../components/Input/Input";
import React, { useState } from "react";
import RegisterButton from "../../components/Button/RegisterButton";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await fetch("https://myproject24.ru/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Вход выполнен");
        setEmail("");
        setPassword("");
      }
      else {
        setMessage(data.message || "Ошибка регистрации");
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
      <div className="rightSide">
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
              <RegisterButton
                text={loading ? "Вход" : "Войти"}
                type="submit"
                disabled={loading}
              ></RegisterButton>
              <p className="errMessage">{message}</p>
            </div>
          </div>
          <div className="toRegister">
            <p>Нет аккаунта?</p>
            <button type="button" onClick={() => navigate("/register")}>Зарегистрироваться</button>
          </div>
        </form>
      </div>
    </div>


  );
}

export default Login;