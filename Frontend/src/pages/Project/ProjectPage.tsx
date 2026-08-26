import "./ProjectPage.css"
import { NavLink } from "react-router-dom";
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import { ProjectStatistic } from "../../components/ProjectStatistic/ProjectStatistic";
import { HiOutlinePencil } from "react-icons/hi";
{/* import TasksCardInProjectPage from "../../components/TaskCard/TasksCardInProjectPage"; */}
import { ProjectInfoDescription } from "../../components/ProjectInfoDescription/ProjectInfoDescription";
import { ProjectCommand } from "../../components/ProjectCommand/ProjectCommand";
import { ProjectActivity } from "../../components/Project/ProjectActivity/ProjectActivity";
import { ProjectFile } from "../../components/Project/ProjectFiles/ProjectFile";
import { useParams } from "react-router-dom";
import { useProjectInfo } from "../../hooks/useProjectInfo";
import { useNavigate } from "react-router-dom";
import { useProjectStages } from "../../hooks/useProjectStages";
import ProjectStages from "../../components/ProjectStages/ProjectStages";

export function ProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { project, loading: loadingProject } = useProjectInfo(Number(id));
  const { stages, loading: loadingStages } = useProjectStages(Number(id));
  if (loadingProject) {
    return <div>Загрузка проекта...</div>;
  }
  if (!project) {
    return <div>Проект не найден</div>;
  }

  function getStatus(status: string) {
    switch (status) {
      case "Active":
        return "Активный"
      case "Completed":
        return "Сделанный"
      case "Archived":
        return "Архивный"
    }
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
                <p className="projectStatus">{getStatus(project?.status)}</p>
              </div>
              <p className="projectPageDescr">{project?.description}.</p>
            </div>
            <button onClick={() => navigate(`/dashboard/project/${project.id}/edit`)} className="buttonProjectTitle"><HiOutlinePencil />Редактировать проект</button>
          </div>
          <div>
            <ProjectStatistic
              project={project}
            />
          </div>
          <div className="tasksCardInProjectPage">
            <ProjectStages
              projectId={Number(id)}
              stages={stages}
              loading={loadingStages}
              onStageClick={(stage) => {
                navigate(`/dashboard/project/${project.id}/stage/${stage.id}`);
              }}
              onStageMenuClick={(stage) => {
                console.log("Меню:", stage);
              }}
            />
            {/* <TasksCardInProjectPage
              tasks={project.tasks}
            />*/}
            
          </div>
        </div>
        <div className="projectPageRight">
          <ProjectInfoDescription
            project={project}
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