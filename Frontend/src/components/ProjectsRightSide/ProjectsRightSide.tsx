import "./ProjectsRightSide.css"
import { HiOutlinePlus } from "react-icons/hi";
import { ProjectPageCard } from "../Project/ProjectPageCard";
import type { Project } from "../../api/projects";
import { NavLink } from "react-router-dom";

function ProjectsRightSide({projects, loading}: {projects: Project[], loading: boolean}) {
  return (
    <div className="projectsRightSide">
      <div className="rightSideTitle">
        <h1>Проекты</h1>
        <button className="newProjectButt"><HiOutlinePlus className="plusIcon" /> Новый проект</button>
      </div>
      <div className="listProjects">
        {loading ? (
          <p>Загрузка...</p>
        ):
        (
          projects.map((project) => (
            <ProjectPageCard
              project={project}
              />
        )))}
      </div>
    </div>
  );
}

export default ProjectsRightSide;