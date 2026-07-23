import api from "./axios";

export type Priority =
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

export type StatusTask =
    | "Todo"
    | "InProgress"
    | "Review"
    | "Done";


export interface Task {
    id: number;
    title: string;
    description: string;
    status: StatusTask;
    priority: Priority;
    deadline: string;
    projectName: string;
    executorName: string;
}

export async function GetMyTask(): Promise<Task[]>{
  const response = await api.get("/tasks/my");
  return response.data;
}