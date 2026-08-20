import "./ProjectDashboard.css"

interface projectProps {
  title: string;
  description: string;
  percentProject: string;
  countTask: string;
}

function ProjectDashboard({ title, description, percentProject, countTask }: projectProps) {
  return (
    <div className="project">
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
        <p>{countTask}</p>
      </div>
    </div>
  );
}

export default ProjectDashboard;