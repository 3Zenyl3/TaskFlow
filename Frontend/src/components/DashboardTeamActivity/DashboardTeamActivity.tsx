import "./DashboardTeamActivity.css"
import PeopleActivity from "../PeopeleActivity/PeopeleActivity";
import type { Activity } from "../../api/teamActivity";

function DashboardTeamActivity({activities, loading}: {activities: Activity[], loading: boolean}) {
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
            src={activity.avatarUrl || "default-avatar-url.jpg"}
            name={activity.userName}
            description={activity.description}
            time={activity.createdAt}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardTeamActivity;
