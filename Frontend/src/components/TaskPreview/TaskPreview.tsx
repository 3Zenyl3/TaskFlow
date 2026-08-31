import "./TaskPreview.css";
import {
  HiOutlineCheckCircle,
  HiOutlineFlag,
  HiOutlineGlobeAlt,
  HiOutlineUserGroup,
  HiOutlineCloud,
  HiOutlineCalendarDays,
  HiOutlineTag,
} from "react-icons/hi2";

import type { TaskCreateData } from "../../types/taskCreate";

type Props = {
  taskData: TaskCreateData;

  projectName?: string;
  stageName?: string;
  assigneeName?: string;
};

function getStatusName(status: string) {
  switch (status) {
    case "Todo":
      return "К выполнению";
    case "InProgress":
      return "В работе";
    case "Review":
      return "На проверке";
    case "Done":
      return "Выполнено";
    default:
      return status || "Не указан";
  }
}

function getPriorityName(priority: string) {
  switch (priority) {
    case "Low":
      return "Низкий приоритет";
    case "Medium":
      return "Средний приоритет";
    case "High":
      return "Высокий приоритет";
    case "Critical":
      return "Критический приоритет";
    default:
      return "Приоритет не указан";
  }
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Не указана";
  }

  return new Intl.DateTimeFormat("ru-RU").format(new Date(date));
}

export function TaskPreview({
  taskData,
  projectName,
  stageName,
  assigneeName,
}: Props) {
  const taskTypes = [
    { label: "Баг", value: "Bug" },
    { label: "Разработка", value: "Development" },
    { label: "Задача", value: "Task" },
    { label: "Улучшение", value: "Improvement" },
  ];
  const taskTypeLabel =
  taskTypes.find(
    (type) => type.value === taskData.type
  )?.label;

  return (
    <div className="taskPreview">
      <h2 className="taskPreviewTitle">Предпросмотр задачи</h2>

      <div className="taskPreviewCard">

        {/* Верхняя строка */}
        <div className="taskPreviewTop">

          <div className="taskPreviewStatus">
            <HiOutlineCheckCircle />

            <span>
              {getStatusName(taskData.status)}
            </span>
          </div>

          <div className="taskPreviewPriority">
            <HiOutlineFlag />

            <span>
              {getPriorityName(taskData.priority)}
            </span>
          </div>

        </div>

        {/* Название */}
        <h1 className="taskPreviewName">
          {taskData.title || "Название задачи"}
        </h1>

        {/* Проект */}
        <div className="taskPreviewProject">
          <HiOutlineGlobeAlt />

          <span>
            Проект: {projectName || taskData.projectId}
          </span>
        </div>

        {/* Описание */}
        <p className="taskPreviewDescription">
          {taskData.description || "Описание задачи будет отображаться здесь..."}
        </p>

        <div className="taskPreviewDivider" />

        {/* Исполнитель */}
        <div className="taskPreviewRow">
          <div className="taskPreviewRowLeft">
            <HiOutlineUserGroup />

            <span>Исполнитель</span>
          </div>

          <span className="taskPreviewValue">
            {assigneeName || "Не выбран"}
          </span>
        </div>

        {/* Этап */}
        <div className="taskPreviewRow">
          <div className="taskPreviewRowLeft">
            <HiOutlineCloud />

            <span>Раздел / Этап</span>
          </div>

          <span className="taskPreviewValue">
            {stageName || "Не выбран"}
          </span>
        </div>

        {/* Тип */}
        <div className="taskPreviewRow">
          <div className="taskPreviewRowLeft">
            <HiOutlineTag />

            <span>Тип задачи</span>
          </div>

          <span className="taskPreviewBadge taskPreviewType">
            {taskTypeLabel || "Не указан"}
          </span>
        </div>

        <div className="taskPreviewDivider" />

        {/* Дата начала */}
        <div className="taskPreviewRow">
          <div className="taskPreviewRowLeft">
            <HiOutlineCalendarDays />

            <span>Дата начала</span>
          </div>

          <span className="taskPreviewValue">
            {formatDate(taskData.startDate)}
          </span>
        </div>

        {/* Дедлайн */}
        <div className="taskPreviewRow">
          <div className="taskPreviewRowLeft">
            <HiOutlineCalendarDays />

            <span>Дедлайн</span>
          </div>

          <span className="taskPreviewValue">
            {formatDate(taskData.deadline)}
          </span>
        </div>

        <div className="taskPreviewDivider" />

        {/* Метки */}
        <div className="taskPreviewTags">
          <span className="taskPreviewTagsTitle">
            Метки
          </span>

          <div className="taskPreviewTagsList">
            {taskData.tags.length > 0 ? (
              taskData.tags.map((tag) => (
                <span
                  className="taskPreviewBadge taskPreviewTag"
                  key={tag}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="taskPreviewValue">
                Нет меток
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}