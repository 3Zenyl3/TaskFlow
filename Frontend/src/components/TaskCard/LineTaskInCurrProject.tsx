import "./LineTaskInCurrProject.css";
import {
  getPriorityName,
  getStatusName,
} from "../../../utils/taskUtils";
import type { ProjectTask } from "../../api/projects";

interface Props {
  task: ProjectTask;
}

function LineTaskInCurrProject({ task }: Props) {
  function getPriorityClass(priority: string) {
    switch (priority) {
      case "Low":
        return "priority low";
      case "Medium":
        return "priority medium";
      case "High":
        return "priority high";
      case "Critical":
        return "priority critical";
      default:
        return "";
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "InProgress":
        return "status work";
      case "Todo":
        return "status todo";
      case "Review":
        return "status review";
      case "Done":
        return "status done";
      default:
        return "";
    }
  }

  function formatDeadline(deadline: string | null) {
    if (!deadline) {
      return "Без дедлайна";
    }

    const date = new Date(deadline);
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return "Завтра";
    }

    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="lineTaskInCurrProject-cardLine">
      <div className="idInTasksCard">
        <p>{task.id}</p>
      </div>

      <div className="lineTaskInCurrProject-cardContent">
        <h3 className="cardTitle">{task.title}</h3>
      </div>

      <span className="lineTaskInCurrProject-executorDiv">
        <span className="executorValue">
          {task.executorName ?? "Не назначен"}
        </span>
      </span>

      <div className="lineTaskInCurrProject-taskInfo">
        <div className="lineTaskInCurrProject-priorityDiv">
          <span
            className={`lineTaskInCurrProject-priority ${getPriorityClass(
              task.priority
            )}`}
          >
            {getPriorityName(task.priority)}
          </span>
        </div>

        <span
          className={`lineTaskInCurrProject-status ${getStatusClass(
            task.status
          )}`}
        >
          {getStatusName(task.status)}
        </span>

        <span className="taskDeadline">
          {formatDeadline(task.deadline.toString())}
        </span>
      </div>
    </div>
  );
}

export default LineTaskInCurrProject;