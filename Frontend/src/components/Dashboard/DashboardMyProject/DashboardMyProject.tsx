import "./DashboardMyProject.css"
import ProjectComponent from "../../Project/ProjectDashboard";
import type { Project } from "../../../api/projects";
import { useNavigate } from "react-router-dom";

function DashboardMyProject({ projects, loading }: { projects: Project[], loading: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="myProjects">
      <header className="myProjectsHeader">
        <h2 className="myProjectsTitle">Недавние проекты</h2>
      </header>
      <div className="myProjectsList">
        {loading && <p>Загрузка...</p>}
        {!loading && projects.map((project) => (
          <ProjectComponent
            key={project.id}
            title={project.name}
            description={project.description}
            percentProject={`${project.progressPercent}%`}
            countTask={project.taskCount.toString()}
            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardMyProject;