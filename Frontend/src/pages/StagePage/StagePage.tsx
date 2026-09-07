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
import { useState } from "react";
import type { StatusTask } from "../../api/tasks";

export function StagePage() {
  const navigate = useNavigate();
  const { id, stageId } = useParams();
  const { project, loading: loadingProject } = useProjectInfo(Number(id));
  const { stage, loading: loadingStage } = useCurrentProjectStages(Number(id), Number(stageId));
  const [taskStatuses, setTaskStatuses] = useState<
    Record<number, StatusTask>
  >({});
  const [taskStages, setTaskStages] = useState<
    Record<number, number>
  >({});
  const [deletedTasks, setDeletedTasks] = useState<number[]>([]);

  if (loadingProject || loadingStage) {
    return <div>Загрузка...</div>;
  }
  if (!project) {
    return <div>Проект не найден</div>;
  }
  if (!stage) {
    return <div>Этап не найден</div>;
  }

  const tasks = project.tasks
    .filter(task => !deletedTasks.includes(task.id))
    .filter(
      task =>
        (taskStages[task.id] ?? task.stageId) === Number(stageId)
    )
    .map(task => ({
      ...task,
      status: taskStatuses[task.id] ?? task.status,
    }));
  const handleTaskStatusChange = (
    taskId: number,
    newStatus: StatusTask
  ) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: newStatus,
    }));
  };
  const handleTaskStageChange = (
    taskId: number,
    newStageId: number
  ) => {
    setTaskStages(prev => ({
      ...prev,
      [taskId]: newStageId,
    }));
  };
  const handleTaskDelete = (taskId: number) => {
    setDeletedTasks(prev => [...prev, taskId]);
  };

  console.log("PARAMS:", { id, stageId });

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
            tasks={tasks}
            project={project}
            stage={stage}
            projectId={Number(id)}
            stageId={Number(stageId)}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskStageChange={handleTaskStageChange}
            onTaskDelete={handleTaskDelete}
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