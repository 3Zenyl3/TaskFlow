import "./CreateProjectRightSide.css"
import { NavLink } from "react-router-dom";
import { CreateProjectsContent } from "../CreateProjectsContent/CreateProjectsContent";

export function CreateProjectRightSide() {
  return (
    <div className="createProjectRightSide">
      <header className="createProjectHeader">
        <div className="createProjectHeaderLeft">
          <div className="projectHeaderLeftContent">
            <NavLink to="/dashboard/projects"><h2 className="backToProjects">{'<'} Проекты</h2></NavLink>
            <span>/</span>
            <h2 className="currentProjectName">Создание проекта</h2>
          </div>
          <NavLink to="/dashboard/projects"> <button className="cancelButton">Отмена</button></NavLink>
        </div>
        <div className="projectHeaderTitlesContainer">
          <h1 className="createProjectTitleH1">Создание проекта</h1>
          <p className="createProjectDescription">Заполните информацию о новом проекте</p>
        </div>
      </header>
      <CreateProjectsContent />
    </div>
  );
}