import "./DashboardLeftSide.css"
import Sidebar from "../Sidebar/Sidebar";
import checkHeadLine from "../../assets/ГалочкаДляTaskFlow.svg"

function DashboardLeftSide() {
  return (
    <div className="dashboardLeftSide">
      <div className="dashboardLogo">
        <img src={checkHeadLine} alt="Галочка" draggable="false" className="dashboardCheckHeadLine" />
        <h1 className="firstHeadline">Task</h1>
        <h1 className="secondHeadline">Flow</h1>
      </div>
      <div>
        <Sidebar />
      </div>
    </div>
  );
}

export default DashboardLeftSide;