import "./PeopeleActivity.css"

interface PeopleActivityProps {
  src: string;
  name: string;
  description: string;
  time: string;
}

function PeopleActivity({src, name, description, time}: PeopleActivityProps) {
  return (
    <div className="peopleActivity">
      <img src={src} alt="" className="peopleAvatar" />
      <div className="peopleInfo">
        <h3 className="peopleActivityName">{name}</h3>
        <p className="peopleActivityDescr">{description}</p>
      </div>
      <span className="peopleActivityTime">{time}</span>
    </div>
  );
}

export default PeopleActivity;