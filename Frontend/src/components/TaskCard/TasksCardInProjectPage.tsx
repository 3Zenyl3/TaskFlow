import "./TasksCardInProjectPage.css";
import { HiOutlinePlus } from "react-icons/hi";
import Input from "../Input/Input";
import { Dropdown } from "../Button/Dropdown";
import { useState } from "react";
import LineTaskInCurrProject from "./LineTaskInCurrProject";
import {
  getPriorityName,
  getStatusName,
} from "../../../utils/taskUtils";
import type { ProjectTask } from "../../api/projects";

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

function TasksCardInProjectPage({ tasks }: Props) {
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
    <div className="tasksInProject">
      <header className="tasksInProjectHeader">
        <div className="tasksInProjectTitle">
          <h3 className="titleIntasksInProject">
            Задачи проекта
          </h3>

          <button className="newTaskButton">
            <HiOutlinePlus />
            Новая задача
          </button>
        </div>

        <div className="tasksInProjectSearch">
          <div className="searchTask">
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
        </div>
      </header>

      <div className="tasksInProjectPage">
        <header className="tasksCardsHeader">
          <div className="idInTasksHeader">ID</div>
          <div className="taskNameInTasksHeader">
            Название задачи
          </div>
          <div className="executorInTasksHeader">
            Исполнитель
          </div>
          <div className="priorityInTasksHeader">
            Приоритет
          </div>
          <div className="statusInTasksHeader">
            Статус
          </div>
          <div className="deadlineInTasksHeader">
            Дедлайн
          </div>
        </header>

        {filteredTasks.map(task => (
          <LineTaskInCurrProject
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}

export default TasksCardInProjectPage;