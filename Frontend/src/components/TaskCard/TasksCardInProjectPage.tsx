import "./TasksCardInProjectPage.css"
import { HiOutlinePlus } from "react-icons/hi";
import Input from "../Input/Input";
import { Dropdown } from "../Button/Dropdown";
import { useState } from "react";

const statuses = [
  "Все",
  "В работе",
  "На ревью",
  "Выполнена",
  "Просрочена",
];

const priorities = [
  "Все",
  "Критический",
  "Высокий",
  "Средний",
  "Низкий",
]
const executors = [
  "Все",
  "Иван Иванов",
  "Петр Петров",
  "Анна Смирнова",
];

function TasksCardInProjectPage() {
  const [status, setStatus] = useState("Все");
  const [priority, setPriority] = useState("Все");
  const [executor, setExecutor] = useState("Все");

  return (
    <div className="tasksInProject">
      <header className="tasksInProjectHeader">
        <div className="tasksInProjectTitle">
          <h3 className="titleIntasksInProject">Задачи проекта</h3>
          <button className="newTaskButton"><HiOutlinePlus /> Новая задача</button>
        </div>
        <div className="tasksInProjectSearch">
          <div className="searchTask">
            <Input
              type="string"
              placeholder="Поиск задач..."
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
    </div>
  );
}

export default TasksCardInProjectPage;