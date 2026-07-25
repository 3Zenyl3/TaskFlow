import api from "./axios";

export interface Activity {
  id: number;
  userName: string;
  avatarUrl?: string;
  description: string;
  createdAt: string;
}

export async function getTeamActivity(): Promise<Activity[]> {
  const response = await api.get("/activities/team");
  return response.data;
}