import "./TaskModal.css";

import {
  HiOutlineXMark,
  HiOutlineEllipsisHorizontal,
  HiOutlineUser,
  HiOutlineSquares2X2,
  HiOutlineTag,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlinePencil,
  HiOutlineArrowsRightLeft,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiOutlineFaceSmile,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";

import { NavLink } from "react-router-dom";

import type { ProjectStage } from "../../api/stages";
import type { Project, ProjectTask } from "../../api/projects";

import { useProjectInfo } from "../../hooks/useProjectInfo";
import { useCurrentProjectStages } from "../../hooks/useCurrentProjectStage";

type TaskModalProps = {
  task: ProjectTask | null;

  project?: Project;
  projectId?: number;

  stage?: ProjectStage;
  stageId?: number;

  onClose: () => void;
};

export function TaskModal(props: TaskModalProps) {
  const { task, onClose } = props;

 
  const projectId =
    "projectId" in props ? props.projectId : undefined;

  const projectFromProps =
    "project" in props ? props.project : undefined;

  const {
    project: projectFromApi,
    loading: loadingProject,
  } = useProjectInfo(Number(projectId));


  const stageId =
    "stageId" in props ? props.stageId : undefined;

  const stageFromProps =
    "stage" in props ? props.stage : undefined;

  const {
    stage: stageFromApi,
    loading: loadingStage,
  } = useCurrentProjectStages(Number(projectId), Number(stageId));

  const project = projectFromProps ?? projectFromApi;
  const stage = stageFromProps ?? stageFromApi;

  if (!task) {
    return null;
  }

  if (loadingProject || loadingStage) {
    return (
      <div className="taskModalOverlay">
        <div className="taskModal">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!project || !stage) {
    return (
      <div className="taskModalOverlay">
        <div className="taskModal">
          <p>Не удалось загрузить данные задачи.</p>

          <button onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="taskModalOverlay"
      onMouseDown={onClose}
    >
      <div
        className="taskModal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="taskModalHeader">
          <div className="projectPageTop">
            <NavLink to="/dashboard/projects">
              <h2 className="backToProjects">
                {"<"} Проекты
              </h2>
            </NavLink>

            <span>/</span>

            <NavLink
              to={`/dashboard/projects/${project.id}`}
            >
              <h2 className="backToProjects">
                {project.name}
              </h2>
            </NavLink>

            <span>/</span>

            <h2 className="currentProjectName">
              Этапы
            </h2>

            <span>/</span>

            <h2 className="currentProjectName">
              {stage.name}
            </h2>
          </div>

          <div className="taskModalHeaderActions">
            <button className="taskModalIconButton">
              <HiOutlineEllipsisHorizontal />
            </button>

            <button
              className="taskModalCloseButton"
              onClick={onClose}
            >
              <HiOutlineXMark />
            </button>
          </div>
        </div>

        <div className="taskModalContent">
          <div className="taskModalMain">
            <div className="taskModalTaskKey">
              {task.key ?? "T-001"}
            </div>

            <h1 className="taskModalTitle">
              {task.title}
            </h1>

            <div className="taskModalMeta">
              <div className="taskModalPriority">
                <span className="priorityArrow">
                  ↑
                </span>

                {task.priority}
              </div>

              <button className="taskModalStatus">
                <span className="statusDot" />

                {task.status ?? "В работе"}

                <span className="statusArrow">
                  ⌄
                </span>
              </button>

              <div className="taskModalDeadline">
                <HiOutlineCalendarDays />

                {task.deadline
                  ? new Date(
                      task.deadline
                    ).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Без дедлайна"}
              </div>
            </div>

            <div className="taskModalDivider" />

            <section className="taskModalSection">
              <h3>Описание</h3>

              <p>
                {task.description ||
                  "Описание задачи отсутствует."}
              </p>
            </section>

            <div className="taskModalDivider" />

            <section className="taskModalComments">
              <div className="taskModalCommentsHeader">
                <h3>Комментарии</h3>

                <span>
                  {task.comments.length}
                </span>
              </div>

              <div className="taskComment">
                <div className="taskCommentAvatar">
                  ИП
                </div>

                <div className="taskCommentContent">
                  <div className="taskCommentTop">
                    <strong>
                      Иван Петров
                    </strong>

                    <span>
                      Сегодня, 10:32
                    </span>
                  </div>

                  <p>
                    API уже готов, осталось
                    добавить проверку токена.
                  </p>
                </div>

                <button className="taskCommentMore">
                  <HiOutlineEllipsisHorizontal />
                </button>
              </div>

              <div className="taskComment">
                <div className="taskCommentAvatar">
                  МИ
                </div>

                <div className="taskCommentContent">
                  <div className="taskCommentTop">
                    <strong>
                      Мария Иванова
                    </strong>

                    <span>
                      Вчера, 18:45
                    </span>
                  </div>

                  <p>
                    Проверила регистрацию —
                    работает.
                  </p>
                </div>

                <button className="taskCommentMore">
                  <HiOutlineEllipsisHorizontal />
                </button>
              </div>

              <div className="taskComment">
                <div className="taskCommentAvatar">
                  АС
                </div>

                <div className="taskCommentContent">
                  <div className="taskCommentTop">
                    <strong>
                      Алексей Смирнов
                    </strong>

                    <span>
                      Вчера, 17:20
                    </span>
                  </div>

                  <p>
                    Нужно добавить лимит запросов
                    для защиты от брутфорса.
                  </p>
                </div>

                <button className="taskCommentMore">
                  <HiOutlineEllipsisHorizontal />
                </button>
              </div>

              <div className="taskCommentInputWrapper">
                <div className="taskModalCurrentAvatar">
                  АА
                </div>

                <input
                  type="text"
                  placeholder="Написать комментарий..."
                />

                <button className="commentInputIcon">
                  <HiOutlinePaperClip />
                </button>

                <button className="commentInputIcon">
                  <HiOutlineFaceSmile />
                </button>

                <button className="commentSendButton">
                  <HiOutlinePaperAirplane />
                  Отправить
                </button>
              </div>
            </section>
          </div>

          <aside className="taskModalSidebar">
            <h3 className="taskModalSidebarTitle">
              Информация
            </h3>

            <div className="taskInfoRow">
              <HiOutlineUser />

              <span className="taskInfoLabel">
                Исполнитель
              </span>

              <div className="taskInfoValue">
                <div className="taskInfoAvatar">
                  ИП
                </div>

                {task.executorName}
              </div>
            </div>

            <div className="taskInfoRow">
              <HiOutlineSquares2X2 />

              <span className="taskInfoLabel">
                Этап
              </span>

              <span className="taskInfoValue">
                {stage.name ?? "Разработка"}
              </span>
            </div>

            <div className="taskInfoRow">
              <HiOutlineTag />

              <span className="taskInfoLabel">
                Тип задачи
              </span>

              <span className="taskInfoValue">
                {task.type ?? "Задача"}
              </span>
            </div>

            <div className="taskInfoRow">
              <HiOutlineCalendarDays />

              <span className="taskInfoLabel">
                Дедлайн
              </span>

              <span className="taskInfoValue taskInfoDeadline">
                {task.deadline
                  ? new Date(
                      task.deadline
                    ).toLocaleDateString("ru-RU")
                  : "Не указан"}
              </span>
            </div>

            <div className="taskInfoRow">
              <HiOutlineClock />

              <span className="taskInfoLabel">
                Создано
              </span>

              <span className="taskInfoValue">
                {task.startDate
                  ? new Date(
                      task.startDate
                    ).toLocaleDateString("ru-RU")
                  : "Не указан"}
              </span>
            </div>

            <div className="taskInfoRow">
              <HiOutlineClock />
            </div>

            <div className="taskTags">
              <h3>Метки</h3>

              <div className="taskTagsList">
                {task.tags.length > 0 ? (
                  task.tags.map((tag) => (
                    <span
                      className="taskPreviewBadge taskPreviewTag"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="taskPreviewValue">
                    Нет меток
                  </span>
                )}
              </div>
            </div>
          </aside>
        </div>

        <div className="taskModalFooter">
          <button className="taskModalFooterButton">
            <HiOutlinePencil />
            Редактировать
          </button>

          <button className="taskModalFooterButton">
            <HiOutlineArrowsRightLeft />
            Переместить в другой этап
          </button>

          <button className="taskModalDeleteButton">
            <HiOutlineTrash />
            Удалить задачу
          </button>
        </div>
      </div>
    </div>
  );
}
