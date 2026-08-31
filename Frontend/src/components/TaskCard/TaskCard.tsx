import "./TaskCard.css"
import {getPriorityName, getStatusName} from "./../../../utils/taskUtils"

interface TaskCardProps {
  title: string;
  description: string;
  deadline: string | Date;
  priority: string;
  status: string;
  onClick?: () => void;
}

function TaskCard({ title, description, deadline, priority, status, onClick }: TaskCardProps) {
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
    <div className="card" onClick={onClick}>
      <div className="cardContent">
        <h3 className="cardTitle">{title}</h3>
        <p className="cardDescr">{description}</p>
      </div>
      <div className="taskInfo">
        <div className="priorityDiv">
          <span className={getPriorityClass(priority)}>
            {getPriorityName(priority)}
          </span>
        </div>
        <span className={getStatusClass(status)}>{getStatusName(status)}</span>
        <span className="taskDeadline">
          {formatDeadline(deadline.toString())}
        </span>
      </div>
    </div>
  );
}
export default TaskCard;