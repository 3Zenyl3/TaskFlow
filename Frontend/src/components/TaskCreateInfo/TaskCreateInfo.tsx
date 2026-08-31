import "./TaskCreateInfo.css";

import type { Project } from "../../api/projects";
import type { TaskCreateData } from "../../types/taskCreate";

import { SelectField } from "../Button/SelectField/SelectField";
import { DatePickerInput } from "../Input/DatePickerInput/DatePickerInput";

type Props = {
  projects: Project[];
  selectedProject?: Project;
  taskData: TaskCreateData;
  setTaskData: React.Dispatch<React.SetStateAction<TaskCreateData>>;
  errors: {
    title: string;
    description: string;
    projectId: string;
    stageId: string;
    type: string;
    executorId: string;
    priority: string;
    startDate: string;
    deadline: string;
  };
};
const taskTypes = [
  { label: "Баг", value: "Bug" },
  { label: "Разработка", value: "Development" },
  { label: "Задача", value: "Task" },
  { label: "Улучшение", value: "Improvement" },
];

const priorities = [
  { label: "Низкий", value: "Low" },
  { label: "Средний", value: "Medium" },
  { label: "Высокий", value: "High" },
  { label: "Критический", value: "Critical" },
];

const statuses = [
  { label: "К выполнению", value: "Todo" },
  { label: "В работе", value: "InProgress" },
  { label: "На проверке", value: "Review" },
  { label: "Готово", value: "Done" },
  { label: "Отложено", value: "Postponed" },
];

export function TaskCreateInfo({
  projects,
  selectedProject,
  taskData,
  setTaskData,
  errors,
}: Props) {
  return (
    <div className="taskCreateInfo">
      <SelectField
        title="Проект"
        required
        values={projects.map((project) => project.name)}
        value={
          projects.find(
            (project) => project.id === taskData.projectId
          )?.name ?? ""
        }
        onChange={(value) => {
          const project = projects.find(
            (project) => project.name === value
          );

          if (!project) return;

          setTaskData((prev) => ({
            ...prev,
            projectId: project.id,
            stageId: project.stages?.[0]?.id ?? null,
            executorId: null,
          }));
        }}
        error={errors.projectId}
      />

      <SelectField
        title="Этап"
        values={
          selectedProject?.stages?.map(
            (stage) => stage.name
          ) ?? []
        }
        value={
          selectedProject?.stages?.find(
            (stage) => stage.id === taskData.stageId
          )?.name ?? ""
        }
        onChange={(value) => {
          const selectedStage = selectedProject?.stages?.find(
            (stage) => stage.name === value
          );

          if (!selectedStage) return;

          setTaskData((prev) => ({
            ...prev,
            stageId: selectedStage.id,
          }));
        }}
        error={errors.stageId}
      />

      <SelectField
        title="Тип задачи"
        values={taskTypes}
      value={taskData.type}
      onChange={(value) => {
        setTaskData((prev) => ({
          ...prev,
          type: value,
        }));
      }}
      error={errors.type}
      />

      <SelectField
        title="Исполнитель"
        required
        values={
          selectedProject?.members?.map(
            (member) => member.userName
          ) ?? []
        }
        value={
          selectedProject?.members?.find(
            (member) => member.userId === taskData.executorId
          )?.userName ?? ""
        }
        onChange={(value) => {
          const selectedMember =
            selectedProject?.members?.find(
              (member) => member.userName === value
            );

          if (!selectedMember) return;

          setTaskData((prev) => ({
            ...prev,
            executorId: selectedMember.userId,
          }));
        }}
        error={errors.executorId}
      />

      <SelectField
        title="Приоритет"
        required
        values={priorities}
        value={taskData.priority}
        onChange={(value) => {
          setTaskData((prev) => ({
            ...prev,
            priority: value,
          }));
        }}
        error={errors.priority}
      />

      <SelectField
        title="Статус"
        values={statuses}
        value={taskData.status}
        onChange={(value) => {
          setTaskData((prev) => ({
            ...prev,
            status: value,
          }));
        }}
      />

      <div className="dateSetting">
        <h4 className="createProjectFormTitle">
          Дата начала
        </h4>

        <DatePickerInput
          value={taskData.startDate}
          onChange={(date) => {
            setTaskData((prev) => ({
              ...prev,
              startDate: date,
            }));
          }}
          error={errors.startDate}
        />
      </div>

      <div className="dateSetting">
        <h4 className="createProjectFormTitle">
          Дедлайн
        </h4>

        <DatePickerInput
          value={taskData.deadline}
          onChange={(date) => {
            setTaskData((prev) => ({
              ...prev,
              deadline: date,
            }));
          }}
          error={errors.deadline}
        />
      </div>

    </div>
  );
}