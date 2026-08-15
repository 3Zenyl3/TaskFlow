import "./ProjectStatistic.css"
import TaskCardInProjectPage from "../TaskCard/TaskCardInProjectPageStatistic";
import DoughnutChart from "./DoughnutChart";
import type { PieChartData } from "./DoughnutChart";
import type { ProjectDetails } from "../../api/projects";

type Props = {
  project: ProjectDetails;
};

export function ProjectStatistic({ project }: Props) {
  const data = [
    {
      label: "Выполнено",
      count: project.completedTaskCount,
      color: "#22a04a"
    },
    {
      label: "В работе",
      count: project.taskInProgressCount,
      color: "#0d85b0"
    },
    {
      label: "К проверке",
      count: project.taskInReviewCount,
      color: "#9422ba"
    },
    {
      label: "Просрочено",
      count: project.overdueTaskCount,
      color: "#a31b1d"
    }
  ];

  const doughnutChartData: PieChartData = {
    labels: data.map(d => d.label),
    datasets: [{
      label: 'Статус задач',
      data: data.map(d => d.count),
      backgroundColor: data.map(d => d.color)
    }]
  };


  return (
    <div className="projectStats">
      <h3 className="projectStatsTitle">Обзор</h3>
      <div className="stats">
        <div className="projectProgress">
          <h4 className="projectStatsCardTitle">Прогресс проекта</h4>
          <div className="progressWrapper">
            <div className="progressBar">
              <div
                className="progress"
                style={{ width: `${project.progressPercent}%` }}
              ></div>
            </div>
            <span className="percenProject">{project.progressPercent}%</span>
          </div>
          <div className="projectProgressInfo">
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">Завершено</span>
              <span className="projectProgressInfoCount Compl">{project.completedTaskCount}</span>
            </div>
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">В работе</span>
              <span className="projectProgressInfoCount InWork">{project.taskInProgressCount}</span>
            </div>
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">Осталось</span>
              <span className="projectProgressInfoCount">{project.leftTaskCount}</span>
            </div>
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">Просрочено</span>
              <span className="projectProgressInfoCount Warn">{project.overdueTaskCount}</span>
            </div>
          </div>
        </div>
        <div className="projectLastTask">
          <h4 className="projectStatsCardTitle">Последние задачи</h4>
          {project.tasks.map(task => (
            <TaskCardInProjectPage
              key={task.id}
              priority={task.priority}
              status={task.status}
              title={task.title}
            />
          ))}
        </div>
        <div className="projectStatTask">
          <h4 className="projectStatsCardTitle">Статистика задач</h4>
          <div className="projectTaskInfo">
            <div className="doughnutChart">
              <DoughnutChart labels={doughnutChartData.labels} datasets={doughnutChartData.datasets} />
              <div className="doughnutCenter">
                <span className="taskText">Всего</span>
                <span className="taskCount">
                  {data.reduce((sum, item) => sum + item.count, 0)}
                </span>
              </div>
            </div>

            <div className="statusLegend">
              {data.map((d, index) => (
                <div key={index} className="legendItem">
                  <span
                    className="legendColor"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  <span>{d.label}</span>
                  <span>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}