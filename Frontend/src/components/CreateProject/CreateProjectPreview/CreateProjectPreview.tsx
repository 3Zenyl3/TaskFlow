import "./CreateProjectPreview.css";
import {
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import type { ProjectCreateData } from "../../../types/projectCreate";
import {
  HiOutlineGlobeAlt,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCodeBracket,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";
import { useState } from "react";


type Props = {
  projectData: ProjectCreateData;
  setProjectData: React.Dispatch<
    React.SetStateAction<ProjectCreateData>>
}

const projectIcons = [
  {
    name: "globe",
    component: HiOutlineGlobeAlt,
  },
  {
    name: "home",
    component: HiOutlineHome,
  },
  {
    name: "briefcase",
    component: HiOutlineBriefcase,
  },
  {
    name: "code",
    component: HiOutlineCodeBracket,
  },
  {
    name: "rocket",
    component: HiOutlineRocketLaunch,
  },
];

export function CreateProjectPreview({ projectData, setProjectData }: Props) {
  const SelectedIcon =
    projectIcons.find(icon => icon.name === projectData.icon)?.component
    ?? HiOutlineGlobeAlt;
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  return (
    <div className="createProjectPreview">
      <h3 className="createProjectTitle">Предпросмотр</h3>

      <div className="previewContent">
        <div className="projectCard">
          <button
            type="button"
            className="projectIcon"
            onClick={() => setIsIconPickerOpen(prev => !prev)}
            style={{
              backgroundColor: projectData.color.background,
              color: projectData.color.value
            }}
          >
            <SelectedIcon />
          </button>
          {isIconPickerOpen && (
            <div className="iconPicker">
              {projectIcons.map(({ name, component: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setProjectData(prev => ({
                      ...prev,
                      icon: name
                    }));

                    setIsIconPickerOpen(false);
                  }}
                >
                  <Icon />
                </button>
              ))}
            </div>
          )}

          <div className="projectInfo">
            <div className="projectHeader">
              <h2>{projectData.title || "Название проекта"}</h2>
              <span
                className="projectStatus"
                style={{
                  backgroundColor: projectData.color.background,
                  color: projectData.color.value
                }}
              >Активный</span>
            </div>

            <p>
              {projectData.description || "Краткое описание проекта будет отображаться здесь."}
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