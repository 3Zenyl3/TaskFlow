import "./CanbanTaskCard.css"
import type { ProjectTask } from "../../../api/projects";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  task: ProjectTask
  isDragging?: boolean;
  onClick?: () => void;
}

export function CanbanTaskCard({ task, isDragging, onClick, }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`CanbanTaskCard ${isDragging ? "dragging" : ""}`}
    >
      <header>
        <h4 className="tasktTitle">{task.title}</h4>
      </header>
      <div className="taskTags1">
        {task.tags?.map((tag) => (
          <span key={tag} className="taskTag">
            {tag}
          </span>
        ))}
      </div>
      <div className="taskInfo">
        <span className="taskDeadline">
          <HiOutlineCalendarDays />
          {new Date(task.deadline).toLocaleDateString("ru-RU")}
        </span>
      </div>
    </div>

  );
}