import "./TitleDashboard.css"
import { HiOutlineBell } from "react-icons/hi";
import { useDashboardHeader } from "../../hooks/useDashboardHeader";

function TitleDashboard() {
  const {userName, notificationCount} = useDashboardHeader();
  return (
    <header className="titleDashboard">
      <div className="headerText">
        <h2 className="helloTitle">Добрый день, {userName}!</h2>
        <p className="helloDescr">
          Вот что происходит в проектах сегодня.
        </p>
      </div>
      <div className="headerActions">
        <button className="notificationButton">
          <HiOutlineBell className="bell" />
          {notificationCount > 0 && (
                        <span className="notificationBadge">
                            {notificationCount}
                        </span>
                    )}
        </button>
      </div>
    </header>
  );
}

export default TitleDashboard;