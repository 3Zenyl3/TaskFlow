import "./TaskCreateRightSide.css"
import { NavLink } from "react-router-dom";
import type { ProjectDetails } from "../../api/projects";
import type { ProjectStage } from "../../api/stages";
import { CreateFormItem } from "../Input/CreateProjectFormItem/CreateProjectFormItem";
import type { TaskCreateData } from "../../types/taskCreate";
import { useState } from "react";
import { TaskPreview } from "../TaskPreview/TaskPreview";
import { useDashboardProject } from "../../hooks/useDashboardProject";
import { HiPlus } from "react-icons/hi";
import { TaskCreateInfo } from "../TaskCreateInfo/TaskCreateInfo";
import { createTask } from "../../types/taskCreate";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

type Props = {
  project: ProjectDetails;
  stage: ProjectStage;
}

export function TaskCreateRightSide({ project, stage }: Props) {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "Todo";

  const { projects: projectList } = useDashboardProject();
  const [taskData, setTaskData] = useState<TaskCreateData>({
    title: "",
    description: "",

    projectId: project.id,
    stageId: stage.id,

    type: "",
    executorId: null,

    priority: "",
    status: initialStatus,

    startDate: null,
    deadline: null,

    tags: [],
  });
  const selectedProject = projectList.find(
    project => project.id === taskData.projectId
  );
  const selectedAssignee = selectedProject?.members.find(
    member => member.userId === taskData.executorId
  );
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    projectId: "",
    stageId: "",
    type: "",
    executorId: "",
    priority: "",
    startDate: "",
    deadline: "",
  });
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setServerError("");
    setSuccessMessage("");

    setErrors({
      title: "",
      description: "",
      projectId: "",
      stageId: "",
      type: "",
      executorId: "",
      priority: "",
      startDate: "",
      deadline: "",
    });

    const newErrors = {
      title: "",
      description: "",
      projectId: "",
      stageId: "",
      type: "",
      executorId: "",
      priority: "",
      startDate: "",
      deadline: "",
    };

    if (!taskData.title.trim()) {
      newErrors.title = "Введите название задачи";
    }

    if (!taskData.projectId) {
      newErrors.projectId = "Выберите проект";
    }

    if (!taskData.stageId) {
      newErrors.stageId = "Выберите этап";
    }

    if (!taskData.executorId) {
      newErrors.executorId = "Выберите исполнителя";
    }

    if (!taskData.priority) {
      newErrors.priority = "Выберите приоритет";
    }
    if (!taskData.startDate) {
      newErrors.startDate = "Выберите дату начала";
    } if (!taskData.deadline) {
      newErrors.deadline = "Выберите дату окончания";
    }

    if (
      taskData.startDate &&
      taskData.deadline &&
      taskData.startDate > taskData.deadline
    ) {
      newErrors.deadline =
        "Дедлайн не может быть раньше даты начала";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      error => error !== ""
    );

    if (hasErrors) {
      return;
    }

    try {
      console.log("Отправляем:", taskData);
      await createTask(taskData);

      setSuccessMessage("Задача успешно создана");

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ??
          "Не удалось создать задачу"
        );
      } else {
        setServerError("Произошла неизвестная ошибка");
      }
    }
  };

  return (
    <div className="taskCreateRightSide">
      <header className="taskCreateTop">
        <NavLink to="/dashboard/projects">
          <h2 className="backToProjects">{'<'} Проекты</h2>
        </NavLink>
        <span>/</span>
        <NavLink to={`/dashboard/projects/${project.id}`}>
          <h2 className="backToProjects">{project.name}</h2>
        </NavLink>
        <span>/</span>
        <h2 className="currentProjectName">Этапы</h2>
        <span>/</span>
        <NavLink to={`/dashboard/project/${project.id}/stage/${stage.id}`}>
          <h2 className="backToProjects">{stage?.name}</h2>
        </NavLink>
      </header>
      <div className="projectHeaderTitlesContainer">
        <h1 className="createProjectTitleH1">Создание задачи</h1>
        <p className="createProjectDescription">Заполните информацию о новой задаче</p>
      </div>
      <div className="taskCreateFormContainer">
        <div className="taskCreateMain">
          <CreateFormItem
            title="Название задачи"
            placeholder="Введите название задачи"
            error={errors.title}
            data={taskData}
            setData={setTaskData}
            field="title"
          />
          <div className="taskDescription">
            <h4 className="createProjectFormTitle">Описание</h4>
            <textarea
              className="inputFieldMax"
              placeholder="Подробное описание задачи..."
              value={taskData.description}
              onChange={(e) =>
                setTaskData(prev => ({
                  ...prev,
                  description: e.target.value
                }))
              }
            />
          </div>
          <div className="createTaskForms">
            <TaskCreateInfo
              projects={projectList}
              selectedProject={selectedProject}
              taskData={taskData}
              setTaskData={setTaskData}
              errors={errors}
            />

            <div className="tagSettingsProject">
              <h4 className="createProjectFormTitle">Метки проекта</h4>
              <div className="tagsInSetting">
                {taskData.tags.map((tag, index) => (
                  <span
                    key={index}>{tag}
                    <button className="deleteTagButton"
                      onClick={() => {
                        setTaskData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {isAddingTag && (
                  <input className="addNewTag"
                    type="text"
                    value={newTag}
                    placeholder="Название метки"
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (!newTag.trim()) return;

                        setTaskData(prev => ({
                          ...prev,
                          tags: [...prev.tags, newTag.trim()]
                        }));

                        setNewTag("");
                        setIsAddingTag(false);
                      }
                    }}
                  />
                )}
                <button onClick={() => setIsAddingTag(true)} className="addTagButton">
                  <HiPlus /> Добавить новую метку
                </button>
              </div>

            </div>

          </div>


        </div>
        <div className="taskCreatePreview">
          <TaskPreview
            taskData={taskData}
            projectName={selectedProject?.name ?? ""}
            stageName={
              selectedProject?.stages.find(
                stage => stage.id === taskData.stageId
              )?.name ?? ""
            }
            assigneeName={
              selectedAssignee
                ? `${selectedAssignee.userName}`
                : "Не назначен"
            }
          />
        </div>


      </div>
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
        >Создать задачу
        </button>
      </div>

    </div>
  );
}