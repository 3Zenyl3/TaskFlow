import "./ProjectPageCard.css"
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState } from "react";
import { useEffect, useRef } from "react";
import type { Project } from "../../api/projects";
import type { UserDto } from "../../api/projects";



export function ProjectPageCard({project}: {project: Project}) {
  const people: UserDto[]  = project.members;

  const visiblePeople = people.slice(0, 3);
  const remaining = people.length - visiblePeople.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
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


  return (
    <div className="project">
      <div className="projectTitleDiv">
        <h3 className="projectTitle">{project.name}</h3>
        <p className="projectDescr">{project.description}</p>
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
        <span className="percentProject">{ project.completedTaskCount / project.taskCount * 100}%</span>
        <div className="progressBar">
          <div
            className="progress"
            style={{ width: "{project.completedTaskCount / project.taskCount * 100}" }}
          ></div>
        </div>
        <div className="progressDescr">
          <p>12 в работе</p>
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
            <button>Открыть проект</button>
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