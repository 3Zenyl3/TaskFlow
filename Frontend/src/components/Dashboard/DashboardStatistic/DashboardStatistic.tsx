import "./DashboardStatistic.css"
import {
  HiOutlineClock, HiOutlineClipboardCheck, HiOutlineClipboardList, HiOutlineExclamation,
} from "react-icons/hi";
import StatisticCard from "../../StatisticCard/StatisticCard";
import type { ProjectTask } from "../../../api/projects";
import { useState } from "react";

type StatisticFilter = "CurrentWeek" | "CurrentMonth" | "PrevWeek" | "PrevMonth";

function DashboardStatistic({ tasks, loading }: { tasks: ProjectTask[], loading: boolean }) {
  const [filter, setFilter] = useState<StatisticFilter>("CurrentWeek");

  const currentFilter = (): string => {
    switch (filter) {
      case "CurrentMonth":
        return "Текущий месяц";
      case "CurrentWeek":
        return "Текущая неделя";
      case "PrevWeek":
        return "Прошлая неделя";
      case "PrevMonth":
        return "Прошлый месяц";
    }
  }

  const strFilter = currentFilter();

  const filterTasks = (): ProjectTask[] => {
    const now = new Date();

    const day = now.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;

    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - daysFromMonday);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);
    endOfCurrentWeek.setHours(23, 59, 59, 999);

    switch (filter) {
      case "CurrentWeek":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);

          return taskDate >= startOfCurrentWeek &&
            taskDate <= endOfCurrentWeek;
        });

      case "CurrentMonth":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);

          return taskDate.getFullYear() === now.getFullYear() &&
            taskDate.getMonth() === now.getMonth();
        });

      case "PrevWeek": {
        const startOfPrevWeek = new Date(startOfCurrentWeek);
        startOfPrevWeek.setDate(startOfCurrentWeek.getDate() - 7);

        const endOfPrevWeek = new Date(startOfCurrentWeek);
        endOfPrevWeek.setDate(startOfCurrentWeek.getDate() - 1);
        endOfPrevWeek.setHours(23, 59, 59, 999);

        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);

          return taskDate >= startOfPrevWeek &&
            taskDate <= endOfPrevWeek;
        });
      }

      case "PrevMonth": {
        const startOfPrevMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

        const startOfCurrentMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);

          return taskDate >= startOfPrevMonth &&
            taskDate < startOfCurrentMonth;
        });
      }
    }
  }

  const filteredTasks: ProjectTask[] = filterTasks();
  const taskCount = filteredTasks.length.toString();
  const completedTaskCount = filteredTasks.filter(task => {
    return task.status === "Done";
  }).length.toString();
  const inProgressTaskCount = filteredTasks.filter(task => {
    return task.status === "InProgress";
  }).length.toString();
  const overdueTaskCount = filteredTasks.filter(task => {
    const deadline = new Date(task.deadline);
    const today = new Date();

    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return task.status !== "Done" && deadline < today;
  }).length.toString();

  if (loading) {
    return (
      <div className="statistic">
        <p>Загрузка</p>
      </div>
    );
  }

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