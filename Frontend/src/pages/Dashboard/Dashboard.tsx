import "./Dashboard.css"
import MyCalendar from "../../components/MyCalendar/MyCalendar";
import DashboardLeftSide from "../../components/DashboardLeftSide/DashboardLeftSide";
import TitleDashboard from "../../components/DashboardTitle/TitleDashboard";
import DashboardMyTask from "../../components/DashboardMyTasks/DashboardMyTasks";
import DashboardStatistic from "../../components/DashboardStatistic/DashboardStatistic";
import DashboardMyProject from "../../components/DashboardMyProject/DashboardMyProject";
import DashboardTeamActivity from "../../components/DashboardTeamActivity/DashboardTeamActivity";
import { useDashboardTasks } from "../../hooks/useDashboardTasks";

function Dashboard() {
  const { tasks, loading } = useDashboardTasks()
  return (
    <div className="dashboard">
      <DashboardLeftSide />
      <div className="dashboardRightSide">
        <TitleDashboard />
        <div className="firstLineRightSide">
          <DashboardMyTask 
          tasks={tasks}
          loading = {loading}
          />
          <DashboardStatistic 
          tasks={tasks}
          loading={loading}
          />
        </div>
        <div className="secondLineRightSide">
          <DashboardMyProject />
          <DashboardTeamActivity />
          <div className="calendar">
            <div className="divCalendar">
              <MyCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;