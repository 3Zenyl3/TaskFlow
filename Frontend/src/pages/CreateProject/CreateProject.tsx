import "./CreateProject.css"
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import { CreateProjectRightSide } from "../../components/CreateProject/CreateProjectRightSide/CreateProjectRightSide";


export function CreateProject() {
  return (
    <div className="createProject">
      <DashboardLeftSide />
      <CreateProjectRightSide />
    </div>
  );
}