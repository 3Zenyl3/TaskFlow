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
  const [errors, setErrors] = useState({
    title: "",
    key: "",
    category: "",
    startDate: "",
    deadline: ""
  });
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateProject = () => {
    const newErrors = {
      title: "",
      key: "",
      category: "",
      startDate: "",
      deadline: ""
    }
    if (!projectData.title.trim()) {
      newErrors.title = "Введите название проекта";
    }

    if (!projectData.key.trim()) {
      newErrors.key = "Введите ключ проекта";
    } else if (!/^[A-Z0-9]+$/.test(projectData.key)) {
      newErrors.key = "Ключ должен содержать только латинские буквы и цифры";
    }

    if (!projectData.category) {
      newErrors.category = "Выберите категорию";
    }

    if (!projectData.startDate) {
      newErrors.startDate = "Укажите дату начала";
    }

    if (
      projectData.deadline &&
      projectData.startDate &&
      projectData.deadline < projectData.startDate
    ) {
      newErrors.deadline = "Дедлайн не может быть раньше даты начала";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(error => error === "");
  }

  const handleCreateProject = async () => {
    setServerError("");
    setSuccessMessage("");
    if (!validateProject()) {
      return;
    }

    try {
      const project = await createProject(projectData);

      console.log("Проект создан:", project);
      setSuccessMessage("Проект успешно создан");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error(
          "Validation errors:",
          JSON.stringify(error.response?.data, null, 2)
        );
        console.log("DATA:", error.response?.data);
        console.log("STATUS:", error.response?.status);
        setServerError(
          error.response?.data?.message ??
          "Не удалось создать проект"
        );
      } else {
        setServerError("Произошла неизвестная ошибка");
      }
    }
  };

  return (
    <div className="createProjectsContent" >
      <CreateProjectMainInfo
        projectData={projectData}
        setProjectData={setProjectData}
        errors={errors}
      />
      <div className="createProjectsContentRight">
        <CreateProjectPreview
          projectData={projectData}
          setProjectData={setProjectData}
        />
        <CreateProjectAdvice />
        <div className="createProjectActions">
          {serverError && (
            <p className="inputErrorText Content">
              {serverError}
            </p>
          )}

          {successMessage && (
            <p className="inputSuccesext">
              {successMessage}
            </p>
          )}

          <button
            className="createProjectSubmit"
            onClick={handleCreateProject}
          >
            Создать проект
          </button>
        </div>
      </div>
    </div>
  );
}