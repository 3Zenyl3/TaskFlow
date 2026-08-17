import "./EditProject.css"
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import { CreateProjectRightSide } from "../../components/CreateProject/CreateProjectRightSide/CreateProjectRightSide";

export function EditProject() {
  return (
    <div className="createProject">
      <DashboardLeftSide />
      <CreateProjectRightSide
        title="Изменение проекта"
        description="Введите данные для изменения проекта"
        mode="edit"
      />
    </div>
  );
}