import api from "./axios"
import type { ProjectColor } from "../types/projectCreate";
import type { Activity } from "./teamActivity";

export interface Project {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: ProjectColor;
  taskCount: number;
  progressPercent: number;
  completedTaskCount: number;
  members: UserDto[];
}

export interface ProjectTask {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: Date;
  projectName: string;
  executorName: string;
}
export interface ProjectDetails {
  id: number;
  name: string;
  description: string;
  status: StatusProject;
  owner: UserDto;
  members: UserDto[];
  taskCount: number;
  taskInProgressCount: number;
  progressPercent: number;
  completedTaskCount: number;
  leftTaskCount: number;
  overdueTaskCount: number;
  tasks: ProjectTask[];
  taskInReviewCount: number;
  startDate: Date;
  endDate: Date | null;
  category: string;
  tags: string[];
  activities: Activity[];
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
export async function GetProject(projectId: number): Promise<ProjectDetails> {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
}