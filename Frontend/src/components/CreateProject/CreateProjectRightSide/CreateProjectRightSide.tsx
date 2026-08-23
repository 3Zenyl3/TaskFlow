import "./CreateProjectRightSide.css"
import { NavLink } from "react-router-dom";
import { CreateProjectsContent } from "../CreateProjectsContent/CreateProjectsContent";
import type { ProjectMode } from "../CreateProjectsContent/CreateProjectsContent";
import { useParams } from "react-router-dom";

type Props = {
  title: string,
  description: string,
  mode:ProjectMode
};

export function CreateProjectRightSide({title, description, mode}: Props,  ) {
  const { id } = useParams();
  const backUrl = mode === "create"
    ? "/dashboard/projects"
    : `/dashboard/projects/${id}`;
  return (
    <div className="createProjectRightSide">
      <header className="createProjectHeader">
        <div className="createProjectHeaderLeft">
          <div className="projectHeaderLeftContent">
            <NavLink to={backUrl}>
              <h2 className="backToProjects">
                {"<"} {mode === "create" ? "Проекты" : "Проект"}
              </h2>
            </NavLink>
            <span>/</span>
            <h2 className="currentProjectName">{title}</h2>
          </div>
          <NavLink to={backUrl}> <button className="cancelButton">Отмена</button></NavLink>
        </div>
        <div className="projectHeaderTitlesContainer">
          <h1 className="createProjectTitleH1">{title}</h1>
          <p className="createProjectDescription">{description}</p>
        </div>
      </header>
      <CreateProjectsContent
        mode={mode}
      />
    </div>
  );
}