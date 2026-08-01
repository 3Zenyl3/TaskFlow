import "./ProjectStatistic.css"
import TaskCardInProjectPage from "../TaskCard/TaskCardInProjectPageStatistic";
import DoughnutChart from "./DoughnutChart";
import type { PieChartData } from "./DoughnutChart";

export function ProjectStatistic() {
  const data: { label: string, count: number, color: string }[] = [
    { label: 'Выполнено', count: 25, color: '#22a04a' },
    { label: 'В работе', count: 10, color: '#0d85b0' },
    { label: 'К проверке', count: 11, color: '#9422ba' },
    { label: 'Просрочено', count: 2, color: '#a31b1d' }
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
                style={{ width: "67%" }}
              ></div>
            </div>
            <span className="percenProject">67%</span>
          </div>
          <div className="projectProgressInfo">
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">Завершено</span>
              <span className="projectProgressInfoCount Compl">25</span>
            </div>
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">В работе</span>
              <span className="projectProgressInfoCount InWork">25</span>
            </div>
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">Осталось</span>
              <span className="projectProgressInfoCount">25</span>
            </div>
            <div className="endTaskProject">
              <span className="projectProgressInfoTitle">Просрочено</span>
              <span className="projectProgressInfoCount Warn">25</span>
            </div>
          </div>
        </div>
        <div className="projectLastTask">
          <h4 className="projectStatsCardTitle">Последние задачи</h4>
          <TaskCardInProjectPage
            priority="Low"
            status="Todo"
            title="API"
          />
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