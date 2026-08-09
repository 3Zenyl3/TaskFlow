import "./CreateProjectsContent.css"
import { CreateProjectMainInfo } from "../CreateProjectMainInfo/CreateProjectMainInfo";
import { CreateProjectPreview } from "../CreateProjectPreview/CreateProjectPreview";
import { CreateProjectAdvice } from "../CreateProjectAdvice/CreateProjectAdvice";
import type { ProjectCreateData } from "../../../types/projectCreate";
import { useState } from "react";

export function CreateProjectsContent() {
  const [projectData, setProjectData] = useState<ProjectCreateData>({
    title: "",
    description: "",
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
    selectedMemberRole: "Участник"
  });
  return (
    <div className="createProjectsContent" >
      <CreateProjectMainInfo
        projectData={projectData}
        setProjectData={setProjectData}
      />
      <div className="createProjectsContentRight">
        <CreateProjectPreview
          projectData={projectData}
        />
        <CreateProjectAdvice />
      </div>
    </div>
  );
}