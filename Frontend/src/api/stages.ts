import api from "./axios";
import type { ProjectColor } from "../types/projectCreate";

export type ProjectStage = {
  id: number;
  name: string;
  description: string;
  icon?: string;
  colorStage?: ProjectColor;

  completedTasks: number;
  totalTasks: number;

  startDate: Date;
  endDate?: Date;
};

export interface CreateProjectStageRequest {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  icon: string;
  stageColor: ProjectColor;
};

export async function GetProjectStages(projectId: number): Promise<ProjectStage[]> {
  const response = await api.get(`/projects/${projectId}/stages`);
  return response.data;
}

export async function GetCurrentProjectStage(projectId: number, stageId: number): Promise<ProjectStage> {
  const response = await api.get(`/projects/${projectId}/stages/${stageId}`);
  return response.data;
}

export async function CreateProjectStage(
  projectId: number,
  stageName: string,
  stageIcon: string,
  stageColor: ProjectColor,
  stageStartDate: Date,
  stageDescr: string,
  stageEndDate?: Date
) {
  const request: CreateProjectStageRequest = {
    name: stageName,
    description: stageDescr,
    startDate: stageStartDate,
    endDate: stageEndDate,
    icon: stageIcon,
    stageColor: stageColor,
  };

  const response = await api.post(
    `/projects/${projectId}/stages`,
    request
  );

  return response.data;
}