import "./ProjectPageCard.css"
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../api/projects";
import type { UserDto } from "../../api/projects";
import {
  HiOutlineGlobeAlt,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCodeBracket,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";


export function ProjectPageCard({ project }: { project: Project }) {
  const people: UserDto[] = project.members;

  const visiblePeople = people.slice(0, 3);
  const remaining = people.length - visiblePeople.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const projectIcons = {
    globe: HiOutlineGlobeAlt,
    home: HiOutlineHome,
    briefcase: HiOutlineBriefcase,
    code: HiOutlineCodeBracket,
    rocket: HiOutlineRocketLaunch,
  };
  const ProjectIcon =
    projectIcons[project.icon as keyof typeof projectIcons]
    ?? HiOutlineBriefcase;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  return (
    <div className="project">
      <div className="projectMainInfo">
        <div
          className="projectIcon"
          style={{
            backgroundColor: project.color?.background ?? "#EEF3FE",
            color: project.color?.value ?? "#3B82F6",
          }}
        >
          <ProjectIcon size={40} />
        </div>

        <div className="projectTitleDiv">
          <h3 className="projectTitle">{project.name}</h3>
          <p className="projectDescr">{project.description}</p>
        </div>
      </div>
      <div className="peopleAndCntTask">
        <div className="peopleInProject">
          {visiblePeople.map(userDTO => (
            <img
              key={userDTO.userId}
              src={userDTO.avatarUrl}
              alt=""
              className="avatar"
            />
          ))}

          {remaining > 0 && (
            <div className="avatar avatarMore">
              +{remaining}
            </div>
          )}
        </div>
        <p className="taskCountInProject">{project.taskCount} задачи</p>
      </div>
      <div className="projectProgressPage">
        <span className="percentProject">{project.progressPercent}%</span>
        <div className="progressBar">
          <div
            className="progress"
            style={{ width: `${project.progressPercent}%` }}
          ></div>
        </div>
        <div className="progressDescr">
          <p>{project.completedTaskCount} выполнено</p>
        </div>
      </div>
      <div className="threePoint" ref={menuRef}>
        <button
          className="projectMenuBtn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <HiOutlineDotsHorizontal size={22} />
        </button>

        {isMenuOpen && (
          <div className="projectMenu">
            <button onClick={() => navigate(`/dashboard/projects/${project.id}`)}>
              Открыть проект
            </button>
            <button>Редактировать</button>
            <button>Участники</button>
            <button>Отчёт</button>

            <div className="projectMenuDivider"></div>

            <button>Архивировать</button>
            <button className="danger">Удалить проект</button>
          </div>
        )}
      </div>

    </div>
  );
}