import "./TaskKanban.css"
import Input from "../Input/Input";
import { Dropdown } from "../Button/Dropdown";
import { useState } from "react";
import {
  getPriorityName,
  getStatusName,
} from "../../../utils/taskUtils";
import type { ProjectTask } from "../../api/projects";
import { CanbanTaskCard } from "../TaskCard/CanbanTaskCard/CanbanTaskCard";
import { HiOutlinePlus } from "react-icons/hi";

const statuses = [
  "Все",
  "Нужно сделать",
  "В работе",
  "Ревью",
  "Выполнена",
  "Просрочена",
];

const priorities = [
  "Все",
  "Критический",
  "Высокий",
  "Средний",
  "Низкий",
];

type Props = {
  tasks: ProjectTask[];
};

export function TaskKanban({tasks}: Props) {
  const [searchValue, setSearchValue] = useState("");
    const [status, setStatus] = useState("Все");
    const [priority, setPriority] = useState("Все");
    const [executor, setExecutor] = useState("Все");
  
    const executors = [
      "Все",
      ...Array.from(
        new Set(
          tasks
            .filter(task => task.executorName)
            .map(task => task.executorName)
        )
      ),
    ];
  
    const filteredTasks = tasks.filter(task => {
      const matchesSearch =
        searchValue === "" ||
        task.title
          .toLowerCase()
          .includes(searchValue.trim().toLowerCase());
  
      const matchesStatus =
        status === "Все" ||
        status === getStatusName(task.status);
  
      const matchesPriority =
        priority === "Все" ||
        priority === getPriorityName(task.priority);
  
      const matchesExecutor =
        executor === "Все" ||
        task.executorName === executor;
  
      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesExecutor
      );
    });

  return (
    <div className="TaskKanban">
      <h2 className="">Задачи</h2>
        <form className="TaskKanbanHeader">
           <div>
            <Input
              type="string"
              placeholder="Поиск задач..."
              value={searchValue}
              onChange={(e) => setSearchValue(e)}
            />
          </div>

          <Dropdown
            title="Статус"
            value={status}
            options={statuses}
            onChange={setStatus}
          />

          <Dropdown
            title="Приоритет"
            value={priority}
            options={priorities}
            onChange={setPriority}
          />

          <Dropdown
            title="Исполнитель"
            value={executor}
            options={executors}
            onChange={setExecutor}
          />
        </form>

        <div className="taskKanbanOfStatus">
          <div className="TasksColumn Todo">
            <h3 className="TaskStatusTitle Todo">К выполнению</h3>
            <CanbanTaskCard />

            <button className="task-board-add">
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </div>
          <div className="TasksColumn InProgress">
            <h3 className="TaskStatusTitle InProgress">В работе</h3>

            <button className="task-board-add">
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </div>
          <div className="TasksColumn Review">
            <h3 className="TaskStatusTitle Review">На проверке</h3>

            <button className="task-board-add">
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </div>
          <div className="TasksColumn Ready">
            <h3 className="TaskStatusTitle Ready">Готово</h3>

            <button className="task-board-add">
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </div>
          <div className="TasksColumn Postponed">
            <h3 className="TaskStatusTitle Postponed">Отложено</h3>

            <button className="task-board-add">
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </div>
        </div>
    </div>
  );
}