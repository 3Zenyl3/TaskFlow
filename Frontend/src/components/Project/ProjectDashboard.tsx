import "./ProjectDashboard.css"

interface projectProps {
  title: string;
  description: string;
  percentProject: string;
  countTask: string;
  onClick?: () => void;
}

function ProjectDashboard({ title, description, percentProject, countTask, onClick }: projectProps) {
  function getTaskWord(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) {
      return "задача";
    }

    if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
    ) {
      return "задачи";
    }

    return "задач";
  }


  return (
    <div className="project" onClick={onClick}>
      <div className="projectTitleDiv">
        <h3 className="projectTitle">{title}</h3>
        <p className="projectDescr1">{description}</p>
      </div>
      <div className="progressBar1">
        <div
          className="progress"
          style={{ width: percentProject }}
        ></div>
      </div>
      <div className="progressBarDescr">
        <span>{percentProject}</span>
        <p>{countTask} {getTaskWord(Number(countTask))}</p>
      </div>
    </div>
  );
}

export default ProjectDashboard;