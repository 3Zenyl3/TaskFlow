import "./LineTaskInCurrProject.css"
import {getPriorityName, getStatusName} from "./../../../utils/taskUtils"
interface TaskCardProps {
  id: string;
  title: string;
  deadline: string;
  priority: string;
  status: string;
  executor: string;
}


function LineTaskInCurrProject({ id, title, deadline, priority, status, executor }: TaskCardProps) {
  function getPriorityClass(priority: string) {
    switch (priority) {
      case "Low":
        return "priority low"
      case "Medium":
        return "priority medium"
      case "High":
        return "priority high"
      case "Critical":
        return "priority critical"
    }
  }
  function getStatusClass(status: string) {
    switch (status) {
      case "InProgress":
        return "status work"
      case "Todo":
        return "status todo"
      case "Review":
        return "status review"
      case "Done":
        return "status done"
    }
  }
  function formatDeadline(deadline: string) {
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
      month: "short"
    });
  }

  return (
    <div className="lineTaskInCurrProject-cardLine">
      <div className="idInTasksCard">
        <p>{id}</p>
      </div>
      <div className="lineTaskInCurrProject-cardContent">
        <h3 className="cardTitle">{title}</h3>
      </div>
      <span className="lineTaskInCurrProject-executorDiv">
        <span className="executorValue">{executor}</span>
      </span>
      <div className="lineTaskInCurrProject-taskInfo">
        <div className="lineTaskInCurrProject-priorityDiv">
          <span className={`lineTaskInCurrProject-priority ${getPriorityClass(priority)}`}>
            {getPriorityName(priority)}
          </span>
        </div>
        <span className={`lineTaskInCurrProject-status ${getStatusClass(status)}`}>{getStatusName(status)}</span>
        <span className="taskDeadline">
          {formatDeadline(deadline)}
        </span>
      </div>
    </div>
  );
}
export default LineTaskInCurrProject;