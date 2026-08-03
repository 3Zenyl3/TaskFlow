import "./Projects.css"
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import ProjectsRightSide from "../../components/ProjectsRightSide/ProjectsRightSide";
import { useDashboardProject } from "../../hooks/useDashboardProject";

function Projects() {
  const {projects, loading} = useDashboardProject();
  return (
    <div className="projects">
      <DashboardLeftSide />
      <ProjectsRightSide 
        loading = {loading}
        projects={projects}
      />
    </div>
  );
}
export default Projects;