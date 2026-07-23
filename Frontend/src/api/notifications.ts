import api from "./axios";

export interface Notification {
    id: number;
    text: string;
    createdAt: string;
    isRead: boolean;
}

export async function GetNotification(): Promise<Notification[]>{
  const response = await api.get("/notifications");
  return response.data;
}