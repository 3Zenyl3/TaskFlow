import api from "./axios";

type UserRole = "User" | "Admin";
export interface Profile{
  id: number;
  userName: string;
  email: string;
  role: UserRole;
  createdAt:string;
  avatarUrl: string;
}

export async function GetProfile(): Promise<Profile>{
  const response = await api.get("users/profile");
  return response.data;
}