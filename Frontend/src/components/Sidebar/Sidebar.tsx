import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { HiOutlineHome, HiOutlineFolder, HiOutlineUserCircle} from "react-icons/hi";

type SidebarProps = {
  isOpen: boolean;
};

function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <NavLink to="/dashboard" end>
        <HiOutlineHome className="menuIcon" />
        Главная
      </NavLink>

      <NavLink to="/dashboard/projects">
        <HiOutlineFolder className="menuIcon" />
        Проекты
      </NavLink>

      <div className="sidebarBottom">
        <NavLink to="/dashboard/profile">
          <HiOutlineUserCircle className="menuIcon" />
          Профиль
        </NavLink>
      </div>


    </div>
  );
}

export default Sidebar;