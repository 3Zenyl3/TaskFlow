import "./DashboardMyTasks.css"
import { useState } from "react";
import TaskCard from "../TaskCard/TaskCard";

function DashboardMyTask() {
  const [active, setActive] = useState("Today")
  const tasks = [
    {
      id: 1,
      title: "Сделать дизайн",
      description: "Нужно подготовить макет страницы",
      deadline: "19.08.26",
      status: "В работе",
      priority: "Высокий"
    },
    {
      id: 2,
      title: "Написать API",
      description: "Нужно подготовить макет страницы",
      deadline: "19.08.26",
      status: "Нужно сделать",
      priority: "Средний"
    },
    {
      id: 3,
      title: "Встреча",
      description: "Нужно подготовить макет страницы",
      deadline: "19.08.26",
      status: "Выполнена",
      priority: "Низкий"
    },
    {
      id: 4,
      title: "Встреча",
      description: "Нужно подготовить макет страницы",
      deadline: "19.08.26",
      status: "Ревью",
      priority: "Критический"
    }
  ];


  return (
    <div className="myTasks">
      <header className="myTasksHeader">
        <h2 className="myTasksTitle">Мои задачи</h2>
        <a href="" className="allTasks" >Смотреть все</a>
      </header>
      <nav className="navMyTasks">
        <button
          className={active === "Today" ? "buttonMyTasks active" : "buttonMyTasks"}
          onClick={() => setActive("Today")}
        >
          Сегодня
        </button>
        <button
          className={active === "Tomorrow" ? "buttonMyTasks active" : "buttonMyTasks"}
          onClick={() => setActive("Tomorrow")}
        >
          Завтра
        </button>
        <button
          className={active === "Week" ? "buttonMyTasks active" : "buttonMyTasks"}
          onClick={() => setActive("Week")}
        >
          На этой неделе
        </button>
      </nav>
      <div className="tasksList">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            deadline={task.deadline}
            status={task.status}
            priority={task.priority}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardMyTask;