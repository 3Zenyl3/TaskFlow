import "./ProjectActivity.css"
import PeopleActivity from "../../PeopeleActivity/PeopeleActivity";
import type { Activity } from "../../../api/teamActivity";

function formatActivityTime(date: string) {
  return new Date(date).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProjectActivity({ activities}: { activities: Activity[] }) {
  return (
    <div className="projectActivity">
      <header className="projectActivityHeader">
        <h3 className="projectActivityTitle">Активность проекта</h3>
        <button className="seeAllActivity">Смотреть все</button>
      </header>
      <div className="activityItems">
        {activities.map(activity => (
          <PeopleActivity
            key={activity.id}
            src={activity.user.avatarUrl}
            description={activity.description}
            name={activity.user.userName}
            time={formatActivityTime(activity.createdAt)}
          />
        ))}
      </div>
    </div>
  );
}