import "./TaskCard.css"

interface TaskCardProps {
  title: string;
  description: string;
  deadline: string;
  priority: string;
  status: string;
}

function TaskCard({ title, description, deadline, priority, status }: TaskCardProps) {
  function getPriorityClass(priority: string){
    switch(priority){
      case "Низкий":
        return "priority low"
      case "Средний":
        return "priority medium"
      case "Высокий":
        return "priority high"
      case "Критический":
        return "priority critical"
    }
  }
  function getStatusClass(status: string){
    switch(status){
      case "В работе":
        return "status work"
      case "Нужно сделать":
        return "status todo"
      case "Ревью":
        return "status review"
      case "Выполнена":
        return "status done"
    }
  }

  return (
    <div className="card">
      <div className="cardContent">
        <h3 className="cardTitle">{title}</h3>
        <p className="cardDescr">{description}</p>
      </div>
      <div className="taskInfo">
        <div className="priorityDiv">
          <span className={getPriorityClass(priority)}>{priority}</span>
        </div>
        <span className={getStatusClass(status)}>{status}</span>
        <span className="taskDeadline">{deadline}</span>
      </div>
    </div>
  );
}
export default TaskCard;