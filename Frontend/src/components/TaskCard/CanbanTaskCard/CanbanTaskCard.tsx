import "./CanbanTaskCard.css"
import type { ProjectTask } from "../../../api/projects";
import { HiOutlineCalendarDays, HiChevronUp, HiChevronDown } from "react-icons/hi2";
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
      className={`CanbanTaskCard ${isDragging ? "dragging" : ""
        } ${task.priority !== "Medium" ? "hasPriority" : ""}`}
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
      <div className={`taskPriority priority-${task.priority.toLowerCase()}`}>
        {task.priority === "Low" && <HiChevronDown />}

        {task.priority === "High" && <HiChevronUp />}

        {task.priority === "Critical" && (
          <>
            <HiChevronUp />
            <HiChevronUp />
          </>
        )}
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