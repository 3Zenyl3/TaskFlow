import "./CreateProjectPreview.css";
import {
  HiOutlineGlobeAlt,
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import type { ProjectCreateData } from "../../../types/projectCreate";

type Props = {
  projectData: ProjectCreateData;
}

export function CreateProjectPreview({ projectData }: Props) {
  return (
    <div className="createProjectPreview">
      <h3 className="createProjectTitle">Предпросмотр</h3>

      <div className="previewContent">
        <div className="projectCard">
          <div
            className="projectIcon"
            style={{
              backgroundColor: projectData.color.background,
              color: projectData.color.value
            }}
          >
            <HiOutlineGlobeAlt />
          </div>

          <div className="projectInfo">
            <div className="projectHeader">
              <h2>Название проекта</h2>
              <span className="projectStatus">Активный</span>
            </div>

            <p>
              Краткое описание проекта будет отображаться здесь.
            </p>
          </div>
        </div>

        <div className="projectDetails">
          <div className="detailRow">
            <div className="detailLeft">
              <HiOutlineTag />
              <span>Категория</span>
            </div>

            <span className="detailValue">{projectData.category || "Не выбрана"}</span>
          </div>

          <div className="detailRow">
            <div className="detailLeft">
              <HiOutlineUsers />
              <span>Участники</span>
            </div>

            <span className="detailValue">0</span>
          </div>

          <div className="detailRow">
            <div className="detailLeft">
              <HiOutlineClipboardDocumentList />
              <span>Задачи</span>
            </div>

            <span className="detailValue">0</span>
          </div>

          <div className="detailRow">
            <div className="detailLeft">
              <HiOutlineCalendarDays />
              <span>Дата начала</span>
            </div>

            <span className="detailValue">
              {projectData.startDate
                ? projectData.startDate.toLocaleDateString("ru-RU")
                : "Не указана"}
            </span>
          </div>

          <div className="detailRow">
            <div className="detailLeft">
              <HiOutlineCalendarDays />
              <span>Дедлайн</span>
            </div>

            <span className="detailValue">
              {projectData.deadline
                ? projectData.deadline.toLocaleDateString("ru-RU")
                : "Не указана"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}