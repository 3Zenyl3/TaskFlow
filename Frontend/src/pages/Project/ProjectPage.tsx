import "./ProjectPage.css"
import { NavLink } from "react-router-dom";
import DashboardLeftSide from "../../components/DashboardLeftSide/DashboardLeftSide";
import { ProjectStatistic } from "../../components/ProjectStatistic/ProjectStatistic";
import { HiOutlinePencil } from "react-icons/hi";
import TasksCardInProjectPage from "../../components/TaskCard/TasksCardInProjectPage";

export function ProjectPage() {

  return (
    <div className="projectPage">
      <DashboardLeftSide />
      <div className="projectPageRightSide">
        <div className="leftPageRightSide">
          <div className="projectPageTop">
            <NavLink to="/dashboard/projects"><h2 className="backToProjects">{'<'} Проекты</h2></NavLink>
            <span>/</span>
            <h2 className="currentProjectName">Internet Shop</h2>
          </div>
          <div className="projectPageTitle">
            <div className="projectPageTitleContent">
              <div className="projectTitle">
                <h1 className="Title">Internet Shop</ h1>
                <p className="projectStatus">Активный</p>
              </div>
              <p className="projectPageDescr">Разработка интернет-магазина с каталогом товаров и оплатой онлайн.</p>
            </div>
            <button className="buttonProjectTitle"><HiOutlinePencil />Редактировать проект</button>
          </div>
          <div>
            <ProjectStatistic />
          </div>
          <div className="tasksCardInProjectPage">
            <TasksCardInProjectPage />
          </div>
        </div>
        <div className="projectPageRight">

        </div>
      </div>
    </div>
  );
}