import { loginAPI } from "../api/login";
import {useState} from "react";

export function useLogin(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  async function login() {
    return loginAPI(email, password);
  }
  return{
    email,
    setEmail,
    password,
    setPassword,
    login
  }
}