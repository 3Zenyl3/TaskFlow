import "./DashboardLeftSide.css"
import Sidebar from "../../Sidebar/Sidebar";
import checkHeadLine from "../../../assets/ГалочкаДляTaskFlow.svg"
import { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";

function DashboardLeftSide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dashboardLeftSide">
      <div className="dashboardLogo">
        <img src={checkHeadLine} alt="Галочка" draggable="false" className="dashboardCheckHeadLine" />
        <h1 className="firstHeadline">Task</h1>
        <h1 className="secondHeadline">Flow</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="openMenuDashboard">
            <HiOutlineMenu></HiOutlineMenu>
        </button>
      </div>
      <div>
        <Sidebar isOpen={isOpen} />
      </div>
    </div>
  );
}

export default DashboardLeftSide;