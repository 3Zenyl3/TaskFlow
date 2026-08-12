import "./CreateProjectsContent.css"
import { CreateProjectMainInfo } from "../CreateProjectMainInfo/CreateProjectMainInfo";
import { CreateProjectPreview } from "../CreateProjectPreview/CreateProjectPreview";
import { CreateProjectAdvice } from "../CreateProjectAdvice/CreateProjectAdvice";
import type { ProjectCreateData } from "../../../types/projectCreate";
import { useState } from "react";
import { createProject } from "../../../api/createProject";
import axios from "axios";

export function CreateProjectsContent() {
  const [projectData, setProjectData] = useState<ProjectCreateData>({
    title: "",
    description: "",
    icon: "globe",
    key: "",
    category: "",
    color: {
      name: "blue",
      value: "#3B82F6",
      background: "#EEF3FE"
    },
    startDate: null,
    deadline: null,
    tags: [],
    members: [],
    selectedMemberRole: "Участник",
    memberEmail: ""
  });

  const handleCreateProject = async () => {
    try {
      const project = await createProject(projectData);

      console.log("Проект создан:", project);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error(
          "Validation errors:",
          JSON.stringify(error.response?.data, null, 2)
        );
      } else {
        console.error("Ошибка:", error);
      }
    }
  };

  return (
    <div className="createProjectsContent" >
      <CreateProjectMainInfo
        projectData={projectData}
        setProjectData={setProjectData}
      />
      <div className="createProjectsContentRight">
        <CreateProjectPreview
          projectData={projectData}
          setProjectData={setProjectData}
        />
        <CreateProjectAdvice />
        <button className="createProjectSubmit" onClick={handleCreateProject}>
          Создать проект
        </button>
      </div>
    </div>
  );
}