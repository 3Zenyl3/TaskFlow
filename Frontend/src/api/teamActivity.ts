import api from "./axios";
import type { UserDto } from "./projects";

export interface Activity {
  id: number;
  user: UserDto;
  avatarUrl?: string;
  description: string;
  createdAt: string;
}

export async function getTeamActivity(): Promise<Activity[]> {
  const response = await api.get("/activities/team");
  return response.data;
}