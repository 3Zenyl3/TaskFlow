import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { HiOutlineHome, HiOutlineFolder, HiOutlineClipboardList, HiOutlineCalendar } from "react-icons/hi";

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

      <NavLink to="/dashboard/tasks">
        <HiOutlineClipboardList className="menuIcon" />
        Мои задачи
      </NavLink>

      <NavLink to="/dashboard/calendar">
        <HiOutlineCalendar className="menuIcon" />
        Календарь
      </NavLink>
    </div>
  );
}

export default Sidebar;