import "./ProjectCommand.css"

export function ProjectCommand(){
  return (
    <div className="projectCommand">
      <header className="projectCommandHeader">
        <h3 className="projectCommandTitle">Участники проекта</h3>
        <button className="addNewMember">Пригласить</button>
      </header>
      <div className="peopleAvatarInProjectComDiv">
        <img src="https://i.pinimg.com/originals/5a/3" alt="" className="peopleAvatarInProjectCom" />
      </div>
    </div>
  );
}