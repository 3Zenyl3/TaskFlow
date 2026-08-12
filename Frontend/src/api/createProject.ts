import api from "./axios";
import type { ProjectCreateData } from "../types/projectCreate";

export async function createProject(projectData: ProjectCreateData) {
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

  const response = await api.post("/projects", request);

  return response.data;
}