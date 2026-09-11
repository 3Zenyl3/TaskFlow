import "./DashboardTeamActivity.css"
import PeopleActivity from "../../PeopeleActivity/PeopeleActivity";
import type { Activity } from "../../../api/teamActivity";

function DashboardTeamActivity({ activities, loading }: { activities: Activity[], loading: boolean }) {
  const formatTime = (createdAt: string) => {
    return new Date(createdAt).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="teamActivity">
      <div className="titleTeamActivity">
        <h2>Активность команды</h2>
        <a href="#" className="seeAllTeamActivity">Смотреть все</a>
      </div>
      <div className="peopleActivitys">
        {loading && <p>Загрузка...</p>}
        {!loading && activities.map(activity => (
          <PeopleActivity
            src={activity.user.avatarUrl || "none"}
            name={activity.user.userName}
            description={activity.description}
            time={formatTime(activity.createdAt)}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardTeamActivity;
