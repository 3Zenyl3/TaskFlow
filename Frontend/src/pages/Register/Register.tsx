import "./Register.css"
import logo from "../../assets/ГалочкаДляTaskFlow.svg"
import tasksPeople from "../../assets/КартинкаTaskFlow.svg"
import Input from "../../../src/components/Input/Input"
import RegisterButton from "../../components/Button/RegisterButton"
import React, { useState } from "react";
import { useRegister } from "../../hooks/useRegister"

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
      <div className="leftSide">
        <div className="logo">
          <img src={logo} alt="Галочка" className="check_mark" />
          <h1 className="titleFirst">Task</h1>
          <h1 className="titleSecond">Flow</h1>
        </div>

        <div className="slogan">
          <h2 className="sloganTitle">
            Командная работа
            <br />
            становится проще
          </h2>
          <p className="sloganDescription">
            TaskFlow помогает командам планировать,
            отслеживать и выполнять задачи
            <br />
            в одном месте.
          </p>
        </div>
        <img src={tasksPeople} alt="" className="taskPeopleImage" />
      </div>
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
          <button type="button">Войти</button>
        </div>
      </form>
    </div>
  );
}

export default Register;