import "./CanbanTaskCard.css"
import type { Task } from "../../../api/tasks";
import { HiOutlineCalendarDays } from "react-icons/hi2";

type Props = {
  task: Task
}

export function CanbanTaskCard(){
  return (
    <div className="CanbanTaskCard">
      <header>
        <h4 className="tasktTitle">Название задачи</h4>
      </header>
      <div className="taskTags">
        <span className="taskTag">Тег</span>
      </div>
      <div className="taskInfo">
        <span className="taskDeadline">
          <HiOutlineCalendarDays />
          12
        </span>
      </div>
    </div>

  );
}