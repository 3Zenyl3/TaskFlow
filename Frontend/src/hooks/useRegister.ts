import { useState } from "react";
import { registerUser } from "../api/auth";

export function useRegister(){
  const[userName, setUserName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function register() {
    if(password.length < 8){
        throw new Error("Пароль меньше 8 символов");
    }

    if(password !== confirmPassword){
        throw new Error("Пароли не совпадают");
    }
    return registerUser(userName, email, password);
  }
  return {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    register
};
}