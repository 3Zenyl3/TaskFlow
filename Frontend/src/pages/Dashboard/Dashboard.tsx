import "./Dashboard.css"
import MyCalendar from "../../components/MyCalendar/MyCalendar";
import DashboardLeftSide from "../../components/DashboardLeftSide/DashboardLeftSide";
import TitleDashboard from "../../components/DashboardTitle/TitleDashboard";
import DashboardMyTask from "../../components/DashboardMyTasks/DashboardMyTasks";
import DashboardStatistic from "../../components/DashboardStatistic/DashboardStatistic";
import DashboardMyProject from "../../components/DashboardMyProject/DashboardMyProject";
import DashboardTeamActivity from "../../components/DashboardTeamActivity/DashboardTeamActivity";
import { useDashboardTasks } from "../../hooks/useDashboardTasks";
import { useDashboardProject } from "../../hooks/useDashboardProject";
import { useDashboardActivity } from "../../hooks/useDashboardActivity";

function Dashboard() {
  const { tasks, loading: loadingTask } = useDashboardTasks()
  const { projects, loading: loadingProjects } = useDashboardProject();
  const { activity, loading: loadingActivities } = useDashboardActivity();

  return (
    <div className="dashboard">
      <DashboardLeftSide />
      <div className="dashboardRightSide">
        <TitleDashboard />
        <div className="firstLineRightSide">
          <DashboardMyTask
            tasks={tasks}
            loading={loadingTask}
          />
          <DashboardStatistic
            tasks={tasks}
            loading={loadingTask}
          />
        </div>
        <div className="secondLineRightSide">
          <DashboardMyProject
            projects={projects}
            loading={loadingProjects}
          />
          <DashboardTeamActivity
            activities={activity}
            loading={loadingActivities}
          />
          <div className="calendar">
            <div className="divCalendar">
              <MyCalendar
                tasks={tasks}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;