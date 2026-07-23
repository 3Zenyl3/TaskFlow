import "./DashboardMyTasks.css"
import { useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import type { Task } from "../../api/tasks";

type TaskFilter = "Today" | "Tomorrow" | "Week";

function DashboardMyTask({ tasks, loading }: { tasks: Task[], loading: boolean }){
  const [active, setActive] = useState<TaskFilter>("Today")

  const filterTasks = tasks.filter(task => {
    const deadLine = new Date(task.deadline);
    const today = new Date();

    if(active === "Today"){
      return deadLine.toDateString() === today.toDateString();
    }
    if(active === "Tomorrow"){
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      return deadLine.toDateString() === tomorrow.toDateString();
    }
    else{
      const endOfWeek = new Date(today);

      const day = today.getDay();
      const daysUntilSunday = day === 0 ? 0 : 7 - day;
      endOfWeek.setDate(today.getDate() + daysUntilSunday)
      endOfWeek.setHours(23, 59, 59, 999);

      return deadLine >= today && deadLine <= endOfWeek;
    }
  })

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
        {loading && <p>Загрузка...</p>}

        {!loading && filterTasks.map(task => (
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