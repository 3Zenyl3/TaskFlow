import "./TasksCardInProjectPage.css"
import { HiOutlinePlus } from "react-icons/hi";
import Input from "../Input/Input";
import { Dropdown } from "../Button/Dropdown";
import { useState } from "react";
import LineTaskInCurrProject from "./LineTaskInCurrProject";
import {getPriorityName, getStatusName} from "./../../../utils/taskUtils"

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
]
const executors = [
  "Все",
  "Иван Иванов",
  "Петр Петров",
  "Анна Смирнова",
];

const tasks = [
  { id: "1", title: "Задача 1", priority: "Low", status: "Review", deadline: "2023-10-01", executor: "Иван Иванов" },
  { id: "2", title: "Задача 2", priority: "High", status: "InProgress", deadline: "2023-10-15", executor: "Петр Петров" },

];



function TasksCardInProjectPage() {
  const [searchValue, setSearchValue] = useState('');
  const [status, setStatus] = useState("Все");
  const [priority, setPriority] = useState("Все");
  const [executor, setExecutor] = useState("Все");

  const filteredTasks = tasks.filter(task => {
    return (
      (searchValue === '' || task.title.toLowerCase().startsWith(searchValue.trim().toLowerCase())) &&
      (status === "Все" || status === getStatusName(task.status)) &&
      (priority === "Все" || priority === getPriorityName(task.priority)) &&
      (executor === "Все" || executor === task.executor)
    )
  })

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
          <div className="taskNameInTasksHeader">Название задачи</div>
          <div className="executorInTasksHeader">Исполнитель</div>
          <div className="priorityInTasksHeader">Приоритет</div>
          <div className="statusInTasksHeader">Статус</div>
          <div className="deadlineInTasksHeader">Дедлайн</div>
        </header>
        {filteredTasks.map(task => (
          <LineTaskInCurrProject
            key={task.id}
            id={task.id}
            priority={task.priority}
            status={task.status}
            title={task.title}
            deadline={task.deadline}
            executor={executor}
          />
        ))}
      </div>
    </div>
  );
}

export default TasksCardInProjectPage;