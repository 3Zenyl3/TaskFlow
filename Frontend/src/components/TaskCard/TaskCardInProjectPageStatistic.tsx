import "./TaskCardInProjectPageStatistic.css"
import {getPriorityName, getStatusName} from "./../../../utils/taskUtils"

interface TaskCardInProjectPageProps {
  title: string;
  priority: string;
  status: string;
}

function TaskCardInProjectPage({ title, priority, status }: TaskCardInProjectPageProps) {
  function getPriorityClass(priority: string) {
    switch (priority) {
      case "Low": return "priority low";
      case "Medium": return "priority medium";
      case "High": return "priority high";
      case "Critical": return "priority critical";
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "InProgress": return "status work";
      case "Todo": return "status todo";
      case "Review": return "status review";
      case "Done": return "status done";
    }
  }

  return (
    <div className="mini-card">
      <h3 className="mini-cardTitle">{title}</h3>
      <div className="mini-cardDetails">
        <span className={getPriorityClass(priority)}>{getPriorityName(priority)}</span>
        <span className={getStatusClass(status)}>{getStatusName(status)}</span>
      </div>
    </div>
  );
}

export default TaskCardInProjectPage;