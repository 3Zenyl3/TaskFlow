import "./DashboardLeftSide.css"
import Sidebar from "../../Sidebar/Sidebar";
import checkHeadLine from "../../../assets/ГалочкаДляTaskFlow.svg"
import { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function DashboardLeftSide() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="dashboardLeftSide">
      <div className="dashboardLogo" >
        <div className="dashboardLogo" onClick={() => navigate("/login")}>
          <img src={checkHeadLine} alt="Галочка" draggable="false" className="dashboardCheckHeadLine" />
          <h1 className="firstHeadline">Task</h1>
          <h1 className="secondHeadline">Flow</h1>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="openMenuDashboard">
            <HiOutlineMenu></HiOutlineMenu>
        </button>
      </div>
        <Sidebar isOpen={isOpen} />
    </div>
  );
}

export default DashboardLeftSide;