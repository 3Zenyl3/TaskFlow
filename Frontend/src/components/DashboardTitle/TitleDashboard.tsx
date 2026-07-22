import "./TitleDashboard.css"
import { HiOutlineBell } from "react-icons/hi";

function TitleDashboard() {
  return (
    <header className="titleDashboard">
      <div className="headerText">
        <h2 className="helloTitle">Добрый день, { }!</h2>
        <p className="helloDescr">
          Вот что происходит в проектах сегодня.
        </p>
      </div>
      <div className="headerActions">
        <button className="notificationButton">
          <HiOutlineBell className="bell" />
          <span className="notificationBadge">3</span>
        </button>
      </div>
    </header>
  );
}

export default TitleDashboard;