import "./ProjectInfoDescription.css"
import { HiOutlineMapPin, HiOutlineCalendar, HiOutlineCalendarDateRange, HiOutlineTag, HiOutlineHashtag } from "react-icons/hi2";
import type { ProjectDetails } from "../../api/projects";
import type { ProjectStage } from "../../api/stages";
import { NavLink } from "react-router-dom";

type Props = {
  project: ProjectDetails;
  stage?: ProjectStage;
};

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "Не указан";
  }

  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProjectInfoDescription({ project, stage }: Props) {
  return (
    <div className="projectInfoDescription">
      <h3 className="projectInfoDescriptionTitle">{!stage ? "О проекте" : "О этапе"}</h3>
      {!stage ? (<>
        <div><p className="infoDescriptionTitle"><HiOutlineMapPin />Владелец: {project.owner.userName}</p></div>
        <div>
          <p className="infoDescriptionTitle">
            <HiOutlineCalendar />
            Создан: {formatDate(project.startDate)}
          </p>
        </div>

        <div>
          <p className="infoDescriptionTitle">
            <HiOutlineCalendarDateRange />
            Дедлайн: {formatDate(project.endDate)}
          </p>
        </div>
        <div><p className="infoDescriptionTitle"><HiOutlineTag />Категория: {project.category}</p></div>
        <div className="projectTags">
          <p className="infoDescriptionTitle">
            <HiOutlineHashtag />
            Метки:
          </p>

          <div className="tagsList">
            {project.tags.length > 0 ? (
              project.tags.map((tag, index) => (
                <span key={index} className="projectTag">
                  {tag}
                </span>
              ))
            ) : (
              <span className="noTags">Нет меток</span>
            )}
          </div>
        </div>
        <div className="projectDescriptionInfo">
          <p className="infoDescriptionTitle">Описание</p>
          <p>{project.description}.</p>
        </div>
      </>) :
        (<>
          <div>
            <p className="infoDescriptionTitle">
              <HiOutlineMapPin />
              Проект:
              <NavLink
                to={`/dashboard/projects/${project.id}`}
                className="backToProjects"
              >
                {project.name}
              </NavLink>
            </p>
          </div>
          <div>
            <p className="infoDescriptionTitle">
              <HiOutlineCalendar />
              Дата начала: {formatDate(stage.startDate)}
            </p>
          </div>

          <div>
            <p className="infoDescriptionTitle">
              <HiOutlineCalendarDateRange />
              Дедлайн: {formatDate(stage.endDate)}
            </p>
          </div>

          <div className="projectDescriptionInfo">
            <p className="infoDescriptionTitle">Описание</p>
            <p>{project.description}.</p>
          </div>
        </>)
      }
    </div>
  );
}