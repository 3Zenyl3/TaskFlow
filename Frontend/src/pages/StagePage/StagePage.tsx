import "./StagePage.css";
import { NavLink } from "react-router-dom";
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import { HiOutlinePencil } from "react-icons/hi";
{/* import TasksCardInProjectPage from "../../components/TaskCard/TasksCardInProjectPage"; */ }
import { ProjectInfoDescription } from "../../components/ProjectInfoDescription/ProjectInfoDescription";
import { ProjectCommand } from "../../components/ProjectCommand/ProjectCommand";
import { ProjectActivity } from "../../components/Project/ProjectActivity/ProjectActivity";
import { ProjectFile } from "../../components/Project/ProjectFiles/ProjectFile";
import { useParams } from "react-router-dom";
import { useProjectInfo } from "../../hooks/useProjectInfo";
import { useNavigate } from "react-router-dom";
import { useCurrentProjectStages } from "../../hooks/useCurrentProjectStage";
import { TaskKanban } from "../../components/TaskKanbanOnStagePage/TaskKanban";

export function StagePage() {
  const navigate = useNavigate();
  const { id, stageId } = useParams();
  const { project, loading: loadingProject } = useProjectInfo(Number(id));
  const { stage, loading: loadingStage } = useCurrentProjectStages(Number(id), Number(stageId));
  if (loadingProject || loadingStage) {
    return <div>Загрузка...</div>;
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
            <NavLink to="/dashboard/projects">
              <h2 className="backToProjects">{'<'} Проекты</h2>
            </NavLink>
            <span>/</span>
            <NavLink to={`/dashboard/projects/${project.id}`}>
              <h2 className="backToProjects">{project.name}</h2>
            </NavLink>
            <span>/</span>
            <h2 className="currentProjectName">Этапы</h2>
            <span>/</span>
            <h2 className="currentProjectName">{stage?.name}</h2>
          </div>
          <div className="projectPageTitle">
            <div className="projectPageTitleContent">
              <div className="projectTitle">
                <h1 className="Title">{stage?.name}</ h1>
              </div>
              <p className="projectPageDescr">{stage?.description}.</p>
            </div>
            <button onClick={() => navigate(`/dashboard/project/${project.id}/edit`)} className="buttonProjectTitle"><HiOutlinePencil />Редактировать этап</button>
          </div>

          <TaskKanban
            tasks={project.tasks}
          />

        </div>
        <div className="projectPageRight">
          <ProjectInfoDescription
            project={project}
            stage={stage}
          />
          <ProjectCommand
            owner={project.owner}
            members={project.members}
          />
          <ProjectActivity
            activities={project.activities}
          />
          <ProjectFile
            projectId={project.id}
            files={project.files}
          />
        </div>
      </div>
    </div>
  );
}