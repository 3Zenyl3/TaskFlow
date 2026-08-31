import api from "./axios";
import type { ProjectTask } from "./projects";

export type Priority =
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

export type StatusTask =
    | "Todo"
    | "InProgress"
    | "Review"
    | "Done"
    | "Postponed";


export interface Task {
    id: number;
    projectId: number;
    title: string;
    description: string;
    status: StatusTask;
    priority: Priority;
    deadline: string;
    projectName: string;
    executorName: string;
}

export async function GetMyTask(): Promise<ProjectTask[]>{
  const response = await api.get("/tasks/my");
  return response.data;
}

export async function updateTaskStatus(taskId: number, status: StatusTask): Promise<void>{
    return api.patch(`/tasks/${taskId}/status`, {
    status,
  });
}