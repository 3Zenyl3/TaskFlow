import "./ProjectPage.css"
import { NavLink } from "react-router-dom";
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import { ProjectStatistic } from "../../components/ProjectStatistic/ProjectStatistic";
import { HiOutlinePencil } from "react-icons/hi";
import TasksCardInProjectPage from "../../components/TaskCard/TasksCardInProjectPage";
import { ProjectInfoDescription } from "../../components/ProjectInfoDescription/ProjectInfoDescription";
import { ProjectCommand } from "../../components/ProjectCommand/ProjectCommand";
import { ProjectActivity } from "../../components/Project/ProjectActivity/ProjectActivity";
import { ProjectFile } from "../../components/Project/ProjectFiles/ProjectFile";
import { useParams } from "react-router-dom";
import { useProjectInfo } from "../../hooks/useProjectInfo";

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProjectInfo(Number(id));
  if (loading) {
    return <div>Загрузка проекта...</div>;
  }
  if (!project) {
    return <div>Проект не найден</div>;
  }

  return (
    <div className="projectPage">
      <DashboardLeftSide />
      <div className="projectPageRightSide">
        <div className="leftPageRightSide">
          <div className="projectPageTop">
            <NavLink to="/dashboard/projects"><h2 className="backToProjects">{'<'} Проекты</h2></NavLink>
            <span>/</span>
            <h2 className="currentProjectName">{project?.name}</h2>
          </div>
          <div className="projectPageTitle">
            <div className="projectPageTitleContent">
              <div className="projectTitle">
                <h1 className="Title">{project?.name}</ h1>
                <p className="projectStatus">{project?.status}</p>
              </div>
              <p className="projectPageDescr">{project?.description}.</p>
            </div>
            <button className="buttonProjectTitle"><HiOutlinePencil />Редактировать проект</button>
          </div>
          <div>
            <ProjectStatistic
              project={project}
            />
          </div>
          <div className="tasksCardInProjectPage">
            <TasksCardInProjectPage
              tasks={project.tasks}
            />
          </div>
        </div>
        <div className="projectPageRight">
          <ProjectInfoDescription
            project={project}
          />
          <ProjectCommand
            members={project.members}
          />
          <ProjectActivity
            activities={project.activities}
          />
          <ProjectFile />
        </div>
      </div>
    </div>
  );
}