import "./Register.css"
import "../../../styles/Auth.css"
import Input from "../../../src/components/Input/Input"
import RegisterButton from "../../components/Button/Button"
import React, { useState } from "react";
import { useRegister } from "../../hooks/useRegister"
import { useNavigate } from "react-router-dom"
import AuthLeftSide from "../../components/AuthLayout/AuthLeftSide"

function Register() {
  const {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    register
  } = useRegister();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleUserNameChange(value: string) {
    const regex = /^[a-zA-Zа-яА-Я0-9_-]*$/;
    if (regex.test(value)) {
      setUserName(value);
    }
  }
  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true)
      const response = await register()

      const data = await response.json();
      if (response.ok) {
        setMessage("Аккаунт создан")
        setUserName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        navigate("/login")
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
    <div className="register">
      <AuthLeftSide></AuthLeftSide>
      <form onSubmit={handleRegister} className="rightSide">
        <div className="registerWindow">
          <h2 className="regTitle">
            Создание аккаунта
          </h2>
          <p className="regDescription">
            Заполните форму ниже, чтобы зарегистрироваться
          </p>
          <div className="regMenu">
            <h3 className="regMunuTitle">
              Имя пользователя
            </h3>
            <Input
              type="text"
              placeholder="Введите имя пользователя"
              value={userName}
              onChange={handleUserNameChange} />
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
            <p className="passwordDescr">
              Минимум 8 символов
            </p>
            <h3 className="regMunuTitle">
              Подтвердите пароль
            </h3>
            <Input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={setConfirmPassword} />
            <p className="passwordDescr">
              Пароли должны совпадать
            </p>
          </div>
          <RegisterButton
            text={loading ? "Регистрация..." : "Зарегистрироваться"}
            type="submit"
            disabled={loading} />
          <p>{message}</p>
        </div>
        <div className="toLogin">
          <p>Уже есть аккаунт?</p>
          <button type="button" onClick={() => navigate("/login")}>Войти</button>
        </div>
      </form>
    </div>
  );
}

export default Register;