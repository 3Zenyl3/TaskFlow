import api from "./axios";

type UserRole = "User" | "Admin";
export interface Profile{
  id: number;
  userName: string;
  description: string;
  email: string;
  role: UserRole;
  createdAt:string;
  avatarUrl: string;
}
export interface PatchProfileRequest{
  userName?: string;
  avatarUrl?: string;
  description?: string;
}

export async function GetProfile(): Promise<Profile>{
  const response = await api.get("users/profile");
  return response.data;
}

export async function PatchProfile(request: PatchProfileRequest): Promise<void>{
  await api.patch("users/profile", request);
}