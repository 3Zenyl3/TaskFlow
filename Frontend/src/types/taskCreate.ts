import api from "../api/axios";

export type TaskCreateData = {
  title: string;
  description: string;

  projectId: number;
  stageId: number | null;

  type: string;
  executorId: number | null;

  priority: string;
  status: string;

  startDate: Date | null;
  deadline: Date | null;
  tags: string[];
};

export function createTask(data: TaskCreateData) {
  const response = api.post("/tasks", data);
  return response;
}
