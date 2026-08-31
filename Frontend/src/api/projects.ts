import api from "./axios"
import type { ProjectColor } from "../types/projectCreate";
import type { Activity } from "./teamActivity";
import type { ProjectCreateData } from "../types/projectCreate";
import type { ProjectStage } from "./stages";

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
  stages: ProjectStage[];
}

export interface ProjectTask {
  id: number;
  projectId: number;
  key: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: Date;
  startDate: Date;
  projectName: string;
  executorName: string;
  stageId: number;
  tags: string[];
  comments:Comment[];
  type: string;
}
export interface Comment{
  id: number;
  author: UserDto;
  createAt:Date;
  text: string;
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
  files: ProjectFileDTO[]
  icon: string;
  key: string;
  color: ProjectColor;
  stages: ProjectStage[];
}

export interface UserDto {
  userId: number;
  userName: string;
  avatarUrl: string;
}
export interface ProjectFileDTO {
    id: number;
    fileName: string;
    contentType: string;
    size: number;
    uploadedAt: Date;
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
export async function UploadProjectFile(projectId: number, file: File):Promise<ProjectFileDTO>  {
  const formData = new FormData();

  formData.append("file", file);
  const response = await api.post(
    `/projects/${projectId}/files`,
    formData
  );
  return response.data;
}
export async function DownloadProjectFile(
  projectId: number,
  fileId: number
) {
  const response = await api.get(
    `/projects/${projectId}/files/${fileId}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
}

export async function UpdateProject(projectData: ProjectCreateData, id: number){
  const request = {
    name: projectData.title,
    description: projectData.description,
    icon: projectData.icon,
    key: projectData.key,
    category: projectData.category,
    color: projectData.color,
    startDate: projectData.startDate,
    deadline: projectData.deadline,
    tags: projectData.tags,
    members: projectData.members.map(member => ({
      email: member.email,
      role: member.role
    }))
  };

  const response = await api.put(`/projects/${id}`, request);

  return response.data;
}