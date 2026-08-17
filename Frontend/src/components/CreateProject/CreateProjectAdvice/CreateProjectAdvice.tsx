import "./CreateProjectAdvice.css"
import { HiOutlineLightBulb } from "react-icons/hi";

export function CreateProjectAdvice() {
  return (
    <div className="createProjectAdvice">
      <div className="createProjectAdviceTitleDiv">
        <HiOutlineLightBulb className="iconLight" />
        <h3 className="createProjectAdviceTitle">Советы</h3>
      </div>
      <div className="advice">
        <ul>
          <li>Выберите понятное и краткое название проекта</li>
          <li>Измените иконку проекта кликнув по ней</li>
          <li>Используйте метки для удобной фильтрации</li>
          <li>Пригласите команду для совместной работы</li>
        </ul>
      </div>
    </div>
  );
}