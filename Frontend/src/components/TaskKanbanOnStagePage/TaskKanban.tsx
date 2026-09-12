import "./TaskKanban.css"
import Input from "../Input/Input";
import { Dropdown } from "../Button/Dropdown";
import { useState } from "react";
import type { ProjectDetails, ProjectTask } from "../../api/projects";
import { CanbanTaskCard } from "../TaskCard/CanbanTaskCard/CanbanTaskCard";
import { HiOutlinePlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  type DragEndEvent,
  useDroppable,
  type DragStartEvent,
  DragOverlay,
  MouseSensor,
  useSensor,
  TouchSensor,
  useSensors,
} from "@dnd-kit/core";
import { updateTaskStatus, } from "../../api/tasks";
import type { StatusTask } from "../../api/tasks";
import { TaskModal } from "../TaskModal/TaskModal";
import type { ProjectStage } from "../../api/stages";
import { useProfile } from "../../hooks/useProfile";

function KanbanColumn({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`TasksColumn ${id} ${isOver ? "dragOver" : ""}`}
    >
      {children}
    </div>
  );
}

type Props = {
  tasks: ProjectTask[];
  project: ProjectDetails;
  stage: ProjectStage;
  projectId: number;
  stageId: number;
  onTaskStatusChange: (taskId: number, status: StatusTask) => void;
  onTaskStageChange: (taskId: number, stageId: number) => void;
  onTaskDelete: (taskId: number) => void;
};


export function TaskKanban({
  tasks,
  project,
  stage,
  projectId,
  stageId,
  onTaskStatusChange,
  onTaskStageChange,
  onTaskDelete,
}: Props) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [tag, setTag] = useState("Все");
  const [executor, setExecutor] = useState("Все");
  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);
  const [selectedTask, setSelectedTask] =
    useState<ProjectTask | null>(null);
  const { profile } = useProfile();
  const currentUserId = profile?.id;

  const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 180,
      tolerance: 10,
    },
  })
);

  const handleDragStart = (event: DragStartEvent) => {
    console.log("DRAG START", event.activatorEvent);
    const task = tasks.find(task => task.id === event.active.id);

    if (task) {
      setActiveTask(task);
    }
  };

  const tags = [
    "Все",
    ...Array.from(
      new Set(
        tasks.flatMap(task => task.tags ?? [])
      )
    ),
  ];

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

    const matchesTag =
      tag === "Все" ||
      task.tags?.includes(tag);

    const matchesExecutor =
      executor === "Все" ||
      task.executorName === executor;

    return (
      matchesSearch &&
      matchesTag &&
      matchesExecutor
    );
  });
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      return;
    }

    const taskId = Number(active.id);
    const newStatus = String(over.id) as StatusTask;

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
      return;
    }

    if (task.status === newStatus) {
      return;
    }

    await updateTaskStatus(taskId, newStatus);
    onTaskStatusChange(taskId, newStatus);
  };
  const handleModalStatusChange = (
    taskId: number,
    newStatus: StatusTask
  ) => {
    onTaskStatusChange(taskId, newStatus);

    setSelectedTask(prev =>
      prev && prev.id === taskId
        ? { ...prev, status: newStatus }
        : prev
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
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
            title="Метка"
            value={tag}
            options={tags}
            onChange={setTag}
          />

          <Dropdown
            title="Исполнитель"
            value={executor}
            options={executors}
            onChange={setExecutor}
          />
        </form>

        <div className="taskKanbanOfStatus">
          <KanbanColumn id="Todo">
            <h3 className="TaskStatusTitle Todo">К выполнению</h3>
            <div className="TasksList">
              {filteredTasks
                .filter(task => task.status === "Todo")
                .map(task => (
                  <CanbanTaskCard
                    key={task.id}
                    task={task}
                    isAssignedToCurrentUser={task.executorId === currentUserId}
                    isDragging={activeTask?.id === task.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
            </div>
            <button className="task-board-add"
              onClick={() =>
                navigate(
                  `/dashboard/project/${projectId}/stage/${stageId}/task/create?status=Todo`
                )
              }
            >
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </KanbanColumn>
          <KanbanColumn id="InProgress">
            <h3 className="TaskStatusTitle InProgress">В работе</h3>
            <div className="TasksList">
              {filteredTasks
                .filter(task => task.status === "InProgress")
                .map(task => (
                  <CanbanTaskCard
                    key={task.id}
                    task={task}
                    isAssignedToCurrentUser={task.executorId === currentUserId}
                    isDragging={activeTask?.id === task.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
            </div>

            <button className="task-board-add"
              onClick={() =>
                navigate(
                  `/dashboard/project/${projectId}/stage/${stageId}/task/create?status=InProgress`
                )
              }
            >
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </KanbanColumn>
          <KanbanColumn id="Review">
            <h3 className="TaskStatusTitle Review">На проверке</h3>
            <div className="TasksList">
              {filteredTasks
                .filter(task => task.status === "Review")
                .map(task => (
                  <CanbanTaskCard
                    key={task.id}
                    task={task}
                    isAssignedToCurrentUser={task.executorId === currentUserId}
                    isDragging={activeTask?.id === task.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
            </div>

            <button className="task-board-add"
              onClick={() =>
                navigate(
                  `/dashboard/project/${projectId}/stage/${stageId}/task/create?status=Review`
                )
              }
            >
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </KanbanColumn>
          <KanbanColumn id="Done">
            <h3 className="TaskStatusTitle Done">Готово</h3>
            <div className="TasksList">
              {filteredTasks
                .filter(task => task.status === "Done")
                .map(task => (
                  <CanbanTaskCard
                    key={task.id}
                    task={task}
                    isAssignedToCurrentUser={task.executorId === currentUserId}
                    isDragging={activeTask?.id === task.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
            </div>

            <button className="task-board-add"
              onClick={() =>
                navigate(
                  `/dashboard/project/${projectId}/stage/${stageId}/task/create?status=Done`
                )
              }
            >
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </KanbanColumn>
          <KanbanColumn id="Postponed">
            <h3 className="TaskStatusTitle Postponed">Отложено</h3>
            <div className="TasksList">
              {filteredTasks
                .filter(task => task.status === "Postponed")
                .map(task => (
                  <CanbanTaskCard
                    key={task.id}
                    task={task}
                    isAssignedToCurrentUser={task.executorId === currentUserId}
                    isDragging={activeTask?.id === task.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
            </div>

            <button className="task-board-add"
              onClick={() =>
                navigate(`/dashboard/project/${projectId}/stage/${stageId}/task/create?status=Postponed`)}
            >
              <HiOutlinePlus />
              Добавить задачу
            </button>
          </KanbanColumn>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <CanbanTaskCard
            task={activeTask}
            isAssignedToCurrentUser={activeTask.executorId === currentUserId}
          />
        ) : null}
      </DragOverlay>
      <TaskModal
        task={selectedTask}
        stage={stage}
        project={project}
        onClose={() => setSelectedTask(null)}
        onTaskStatusChange={handleModalStatusChange}
        onTaskStageChange={onTaskStageChange}
        onTaskDelete={onTaskDelete}
      />
    </DndContext>
  );
}