import "./ProjectPageCard.css"
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState } from "react";
import { useEffect, useRef } from "react";

const people = [
  { id: 1, avatar: "https://i.pravatar.cc/100?img=1" },
  { id: 2, avatar: "https://i.pravatar.cc/100?img=2" },
  { id: 3, avatar: "https://i.pravatar.cc/100?img=3" },
  { id: 4, avatar: "https://i.pravatar.cc/100?img=4" },
  { id: 5, avatar: "https://i.pravatar.cc/100?img=5" },
];


export function ProjectPageCard() {
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
        <h3 className="projectTitle">Internet shop</h3>
        <p className="projectDescr">Разработка интернет магазина</p>
      </div>
      <div className="peopleAndCntTask">
        <div className="peopleInProject">
          {visiblePeople.map(person => (
            <img
              key={person.id}
              src={person.avatar}
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
        <p className="taskCount">24 задачи</p>
      </div>
      <div className="projectProgressPage">
        <span className="percentProject">67%</span>
        <div className="progressBar">
          <div
            className="progress"
            style={{ width: "67%" }}
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