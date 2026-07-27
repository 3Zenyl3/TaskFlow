import "./ProjectsRightSide.css"
import { HiOutlinePlus } from "react-icons/hi";
import { ProjectPageCard } from "../Project/ProjectPageCard";

function ProjectsRightSide() {
  return (
    <div className="projectsRightSide">
      <div className="rightSideTitle">
        <h1>Проекты</h1>
        <button className="newProjectButt"><HiOutlinePlus className="plusIcon" /> Новый проект</button>
      </div>
      <div className="listProjects">
        <ProjectPageCard />
        <ProjectPageCard />
        <ProjectPageCard />
        <ProjectPageCard />
        <ProjectPageCard />
        <ProjectPageCard />
        <ProjectPageCard />
        <ProjectPageCard />
        <ProjectPageCard />  
      </div>
    </div>
  );
}

export default ProjectsRightSide;