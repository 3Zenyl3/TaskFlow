import logo from "../../assets/ГалочкаДляTaskFlow.svg"
import tasksPeople from "../../assets/КартинкаTaskFlow.svg"

function AuthLeftSide(){
  return(
    <div className="leftSide">
        <div className="logo">
          <img src={logo} alt="Галочка" className="check_mark" draggable="false"/>
          <h1 className="titleFirst">Task</h1>
          <h1 className="titleSecond">Flow</h1>
        </div>

        <div className="slogan">
          <h2 className="sloganTitle">
            Командная работа
            <br />
            становится проще
          </h2>
          <p className="sloganDescription">
            TaskFlow помогает командам планировать,
            отслеживать и выполнять задачи
            <br />
            в одном месте.
          </p>
        </div>
        <img src={tasksPeople} alt="" className="taskPeopleImage" />
      </div>
  );
}

export default AuthLeftSide;