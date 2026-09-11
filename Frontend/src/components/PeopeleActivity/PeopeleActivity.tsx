import "./PeopeleActivity.css"

interface PeopleActivityProps {
  src: string;
  name: string;
  description: string;
  time: string;
}

function PeopleActivity({ src, name, description, time }: PeopleActivityProps) {
  return (
    <div className="peopleActivity">
      <div className="peopleInfo">
        {src != "none" ? (
          <img src={src} alt="" className="peopleAvatar" />
        ) : (
          <div className="peopleAvatar">{name.slice(0, 2).toUpperCase()}</div>
        )}
        
        <div className="peopleText">
          <h3 className="peopleActivityName">{name}</h3>
          <p className="peopleActivityDescr">{description}</p>
        </div>
      </div>
      <span className="peopleActivityTime">{time}</span>
    </div>
  );
}

export default PeopleActivity;