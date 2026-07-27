import "./Projects.css"
import DashboardLeftSide from "../../components/DashboardLeftSide/DashboardLeftSide";
import ProjectsRightSide from "../../components/ProjectsRightSide/ProjectsRightSide";

function Projects(){
  return(
    <div className="projects">
      <DashboardLeftSide />
      <ProjectsRightSide />
    </div>
  );
}
export default Projects;