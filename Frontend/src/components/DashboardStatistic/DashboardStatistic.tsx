import "./DashboardStatistic.css"
import {
  HiOutlineClock, HiOutlineClipboardCheck, HiOutlineClipboardList, HiOutlineExclamation,
} from "react-icons/hi";
import StatisticCard from "../../components/StatisticCard/StatisticCard";
import type { Task } from "../../api/tasks";
import { useState } from "react";

type StatisticFilter = "CurrentWeek" | "CurrentMonth" | "PrevWeek" | "PrevMonth";

function DashboardStatistic({ tasks, loading }: { tasks: Task[], loading: boolean }) {
  const [filter, setFilter] = useState<StatisticFilter>("CurrentWeek");
  
  const currentFilter = (): string=> {
    switch (filter) {
      case "CurrentMonth":
        return "Текущий месяц";
      case "CurrentWeek":
        return "Текущая неделя";
      case "PrevWeek":
        return "Прошлая неделя";
      case "PrevMonth":
        return "Прошлый месяц";
  }}

  const strFilter = currentFilter();

  const filterTasks = (): Task[] => {
    switch (filter) {
      case "CurrentMonth":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          const now = new Date();

          return taskDate.getFullYear() === now.getFullYear() &&
            taskDate.getMonth() === now.getMonth();
        });
      case "PrevWeek":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          const now = new Date();
          const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() + 6) % 7));
          const endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
      case "PrevMonth":
        return tasks.filter(task => {
          const now = new Date();
          const taskDate = new Date(task.deadline);

          const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastDayOfLastMounth = new Date(now.getFullYear(), now.getMonth(), 0);
          return taskDate >= firstDayOfLastMonth && taskDate <= lastDayOfLastMounth;
        })
      default:
        return tasks.filter(task => {
          const deadline = new Date(task.deadline);
          return deadline < new Date();
        });
    }
  }

  const filteredTasks: Task[] = filterTasks();
  const taskCount = filteredTasks.length.toString();
  const completedTaskCount = filteredTasks.filter(task => {
    return task.status === "Done";
  }).length.toString();
  const inProgressTaskCount = filteredTasks.filter(task => {
    return task.status === "InProgress";
  }).length.toString();
  const overdueTaskCount = filteredTasks.filter(task => {
    const deadline = new Date(task.deadline);
    return task.status != "Done" && deadline < new Date();
  }).length.toString();


  return (
    <div className="statistic">
      <div className="statisticHeader">
        <h2 className="statisticTitle">Статистика</h2>
        <div className="dropDownButton">
          <button className="dropButton"><p>{strFilter}</p><span className="arrow">▼</span></button>
          <div className="dropdownContent">
            <a href="#" onClick={() => setFilter("CurrentWeek")}>Текущая неделя</a>
            <a href="#" onClick={() => setFilter("CurrentMonth")}>Текущий месяц</a>
            <a href="#" onClick={() => setFilter("PrevWeek")}>Прошлая неделя</a>
            <a href="#" onClick={() => setFilter("PrevMonth")}>Прошлый месяц</a>
          </div>
        </div>
      </div>
      <div className="statisticsInfo">
        <div className="firstLineStatistic">
          <StatisticCard
            title="Всего задач"
            count={taskCount}
            backgroundColor="#f6f9fe"
            color="#287dfc"
            emoji={HiOutlineClipboardList}
          />
          <StatisticCard
            title="Выполнено"
            count={completedTaskCount}
            backgroundColor="#f6faf9"
            color="#08a368"
            emoji={HiOutlineClipboardCheck}
          />
        </div>
        <div className="secondLineStatistic">
          <StatisticCard
            title="В работе"
            count={inProgressTaskCount}
            backgroundColor="#fef9f5"
            color="#fd8b01"
            emoji={HiOutlineClock}
          />
          <StatisticCard
            title="Просрочено"
            count={overdueTaskCount}
            backgroundColor="#fcf5f5"
            color="#f91d1d"
            emoji={HiOutlineExclamation}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardStatistic;