import "./CreateProjectsContent.css"
import { CreateProjectMainInfo } from "../CreateProjectMainInfo/CreateProjectMainInfo";
import { CreateProjectPreview } from "../CreateProjectPreview/CreateProjectPreview";
import { CreateProjectAdvice } from "../CreateProjectAdvice/CreateProjectAdvice";
import type { ProjectCreateData } from "../../../types/projectCreate";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createProject } from "../../../api/createProject";
import axios from "axios";
import { GetProject } from "../../../api/projects";
import { UpdateProject } from "../../../api/projects";

export type ProjectMode = "create" | "edit";

type CreateProjectsContentProps = {
  mode: ProjectMode;
}

export function CreateProjectsContent({ mode }: CreateProjectsContentProps) {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }

    if (!id) {
      return;
    }

    const loadProject = async () => {
      try {
        setLoading(true);
        setServerError("");

        const project = await GetProject(Number(id));

        setProjectData({
          title: project.name,
          description: project.description,
          icon: project.icon,
          key: project.key,
          category: project.category,
          color: project.color,
          startDate: project.startDate
            ? new Date(project.startDate)
            : null,
          deadline: project.endDate
            ? new Date(project.endDate)
            : null,
          tags: project.tags ?? [],
          members: project.members.map((member) => ({
            email: member.userName,
            role: "Участник",
          })),
          selectedMemberRole: "Участник",
          memberEmail: "",

        });
      } catch (error) {
        console.error("Ошибка загрузки проекта:", error);

        if (axios.isAxiosError(error)) {
          setServerError(
            error.response?.data?.message ??
            "Не удалось загрузить проект"
          );
        } else {
          setServerError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [mode, id]);

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

  const handleSubmit = async () => {
    setServerError("");
    setSuccessMessage("");

    if (!validateProject()) {
      return;
    }

    try {
      if (mode === "create") {
        const project =
          await createProject(projectData);

        console.log(
          "Проект создан:",
          project
        );

        setSuccessMessage(
          "Проект успешно создан"
        );

        return;
      }

      if (!id) {
        setServerError(
          "Не указан идентификатор проекта"
        );
        return;
      }

      const project =
        await UpdateProject(
          projectData,
          Number(id)
        );

      console.log(
        "Проект изменён:",
        project
      );

      setSuccessMessage(
        "Проект успешно изменён"
      );
    } catch (error) {
      console.error(
        "Ошибка сохранения проекта:",
        error
      );

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ??
          (mode === "create"
            ? "Не удалось создать проект"
            : "Не удалось изменить проект")
        );
      } else {
        setServerError(
          "Произошла неизвестная ошибка"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="createProjectsContent">
        <p>Загрузка проекта...</p>
      </div>
    );
  }

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
            onClick={handleSubmit}
          >
            {mode === "create"
              ? "Создать проект"
              : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}