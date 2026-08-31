import "./TaskCreate.css"
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import { TaskCreateRightSide } from "../../components/TaskCreateRightSide/TaskCreateRightSide";
import { useProjectInfo } from "../../hooks/useProjectInfo";
import { useCurrentProjectStages } from "../../hooks/useCurrentProjectStage";
import { useParams } from "react-router-dom";

export function TaskCreate(){
  const { id, stageId } = useParams();
  const { project, loading: loadingProject } = useProjectInfo(Number(id));
  const { stage, loading: loadingStage } = useCurrentProjectStages(Number(id), Number(stageId));

  if (loadingProject || loadingStage) {
    return <div>Загрузка...</div>;
  }
  if (!project || !stage) {
    return <div>Проект не найден</div>;
  }

  return (
    <div className="createProject">
      <DashboardLeftSide />
      <TaskCreateRightSide 
        project={project}
        stage={stage}
      />
    </div>

  );
}