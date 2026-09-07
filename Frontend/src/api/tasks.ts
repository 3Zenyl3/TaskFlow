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
export type Comment = {
  id: number;
  author: {
    userId: number;
    userName: string;
    avatarUrl?: string;
  };
  text: string;
  createAt: string;
};


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

export async function GetMyTask(): Promise<ProjectTask[]> {
  const response = await api.get("/tasks/my");
  return response.data;
}

export async function updateTaskStatus(taskId: number, status: StatusTask): Promise<void> {
  return api.patch(`/tasks/${taskId}/status`, {
    status,
  });
}

export const updateTaskStage = async (
  taskId: number,
  stageId: number
) => {
  const response = await api.patch(
    `/tasks/${taskId}/stage`,
    { stageId }
  );

  return response.data;
};

export const deleteTask = async (
  taskId: number
) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
}

export async function getTaskComments(taskId: number) {
  const response = await api.get<Comment[]>(
    `/tasks/${taskId}/comments`
  );

  return response.data;
}
export async function createTaskComment(
  taskId: number,
  text: string
) {
  const response = await api.post<Comment>(
    `/tasks/${taskId}/comments`,
    {
      text
    }
  );

  return response.data;
}