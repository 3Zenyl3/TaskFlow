import "./DashboardMyProject.css"
import ProjectComponent from "../Project/Project";
import type { Project } from "../../api/projects";

function DashboardMyProject({ projects, loading }: { projects: Project[], loading: boolean }) {
  return (
    <div className="myProjects">
      <header className="myProjectsHeader">
        <h2 className="myProjectsTitle">Недавние проекты</h2>
      </header>
      <div className="myProjectsList">
        {loading && <p>Загрузка...</p>}
        {!loading && projects.map((project) => (
          <ProjectComponent
            title={project.name}
            description={project.description}
            percentProject={`${project.progress}%`}
            countTask={project.taskCount.toString()}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardMyProject;