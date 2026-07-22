import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { HiOutlineHome, HiOutlineFolder, HiOutlineClipboardList, HiOutlineCalendar } from "react-icons/hi";

function Sidebar(){
  return (
    <div className="sidebar">
      <NavLink to="/dashboard"><HiOutlineHome className="menuIcon" /> Главная</NavLink>
      <NavLink to="/projects"><HiOutlineFolder className="menuIcon"/> Проекты</NavLink>
      <NavLink to="/tasks"><HiOutlineClipboardList className="menuIcon"/> Мои задачи</NavLink>
      <NavLink to="/calendar"><HiOutlineCalendar className="menuIcon"/> Календарь</NavLink>
    </div>
  );
}

export default Sidebar;