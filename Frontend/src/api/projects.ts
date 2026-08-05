import api from "./axios"

export interface Project {
  id: number;
  name: string;
  taskCount: number;
  progressPercent: number;
  completedTaskCount: number;
  members: UserDto[];
}


export interface ProjectDetails {
  id: number;
  name: string;
  description: string;
  status: StatusProject;
  owner: UserDto;
  members: UserDto[];
  taskCount: number;
  progressPercent: number;
  completedTaskCount: number;
}

export interface UserDto {
  userId: number;
  userName: string;
  avatarUrl: string;
}
export type StatusProject = "Active" | "Completed" | "Archived";

export async function GetProjects(): Promise<Project[]> {
  const response = await api.get("/projects");
  return response.data;
}