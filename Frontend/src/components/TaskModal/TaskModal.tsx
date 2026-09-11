import "./TaskModal.css";

import {
  HiOutlineXMark,
  HiOutlineEllipsisHorizontal,
  HiOutlineUser,
  HiOutlineSquares2X2,
  HiOutlineTag,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineArrowsRightLeft,
  HiOutlineTrash,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";

import { NavLink } from "react-router-dom";

import type { Project, ProjectTask } from "../../api/projects";

import { useProjectInfo } from "../../hooks/useProjectInfo";
import { useCurrentProjectStages } from "../../hooks/useCurrentProjectStage";
import { useEffect, useState } from "react";
import {
  getTaskComments,
  createTaskComment,
  updateTaskStage,
  deleteTask
} from "../../api/tasks";
import type { Comment } from "../../api/tasks";
import type { StatusTask } from "../../api/tasks";
import { updateTaskStatus } from "../../api/tasks";
import {
  type ProjectStage
} from "../../api/stages";
import { useProjectStages } from "../../hooks/useProjectStages";

type TaskModalProps = {
  task: ProjectTask | null;
  onClose: () => void;
  onTaskStatusChange?: (taskId: number, status: StatusTask) => void;
  onTaskStageChange?: (taskId: number, stageId: number) => void;
  onTaskDelete?: (taskId: number) => void;
} & (
    | {
      project: Project;
      projectId?: never;
    }
    | {
      projectId: number;
      project?: never;
    }
  ) & (
    | {
      stage: ProjectStage;
      stageId?: never;
    }
    | {
      stageId: number;
      stage?: never;
    }
  );

function translateTaskType(type?: string | null): string {
  const translations: Record<string, string> = {
    Task: "Задача",
    Bug: "Ошибка",
    Feature: "Новая функция",
    Improvement: "Улучшение",
    Development: "Разработка",
  };

  return type ? translations[type] ?? type : "Задача";
}

export function TaskModal(props: TaskModalProps) {
  const { task, onClose, onTaskStatusChange, onTaskStageChange, onTaskDelete } = props;
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSending, setCommentSending] = useState(false);
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const [stageOverride, setStageOverride] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!task) {
      return;
    }

    const loadComments = async () => {
      try {
        setCommentsLoading(true);

        const data = await getTaskComments(task.id);

        setComments(data);
      } catch (error) {
        console.error("Не удалось загрузить комментарии:", error);
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [task?.id]);

const statuses: StatusTask[] = [
  "Todo",
  "InProgress",
  "Review",
  "Done",
  "Postponed"
];
const statusNames = {
  Todo: "К выполнению",
  InProgress: "В работе",
  Review: "На проверке",
  Done: "Выполнено",
  Postponed: "Отложено"
};


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
const {
  stages: projectStages,
  loading: stagesLoading,
} = useProjectStages(project?.id);


if (!task) {
  return null;
}
const currentStageId =
  stageOverride ?? task.stageId ?? stage?.id ?? 0;
const handleStatusChange = async (newStatus: StatusTask) => {
  try {
    await updateTaskStatus(task.id, newStatus);

    onTaskStatusChange?.(task.id, newStatus);

    setIsStatusOpen(false);
  } catch (error) {
    console.error("Не удалось изменить статус:", error);
  }
};
const handleCreateComment = async () => {
  const text = commentText.trim();

  if (!text) {
    return;
  }

  try {
    setCommentSending(true);

    const newComment = await createTaskComment(
      task.id,
      text
    );
    console.log("NEW COMMENT:", newComment);
    setComments(prev => [
      ...prev,
      newComment
    ]);

    setCommentText("");
  } catch (error) {
    console.error(
      "Не удалось добавить комментарий:",
      error
    );
  } finally {
    setCommentSending(false);
  }
};

const handleStageChange = async (newStageId: number) => {
  try {
    const updatedStage = await updateTaskStage(task.id, newStageId);

    console.log("Этап изменён:", updatedStage);
    onTaskStageChange?.(task.id, newStageId);
    setStageOverride(newStageId);

    setIsStageMenuOpen(false);
  } catch (error) {
    console.error("Ошибка при изменении этапа:", error);
  }
};
const handleDeleteTask = async (taskId: number) => {
  try {
    setDeleteLoading(true);

    await deleteTask(taskId);

    onTaskDelete?.(taskId);
    console.log("Задача удалена");

    setIsDeleteConfirmOpen(false);
    onClose();
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
  } finally {
    setDeleteLoading(false);
  }
};


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
          <NavLink
            to={`/dashboard/project/${project.id}/stage/${stage.id}`}
          >
            <h2 className="backToProjects">
              {stage.name}
            </h2>
          </NavLink>
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

            <div className="taskModalStatusWrapper">
              <button
                className="taskModalStatus"
                onClick={() => setIsStatusOpen(prev => !prev)}
              >
                <span className="statusDot" />

                {statusNames[task.status as StatusTask] ?? "В работе"}

                <span className="statusArrow">
                  v
                </span>
              </button>

              {isStatusOpen && (
                <div className="statusDropdown">
                  {statuses.map(status => (
                    <button
                      key={status}
                      className="statusOption"
                      onClick={() => handleStatusChange(status as StatusTask)}
                    >
                      <span className="statusDot" />
                      {statusNames[status]}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
            {commentsLoading ? (
              <p>Загрузка комментариев...</p>
            ) : comments.length === 0 ? (
              <p>Комментариев пока нет.</p>
            ) : (
              comments.map(comment => (
                <div
                  className="taskComment"
                  key={comment.id}
                >
                  <div className="taskCommentAvatar">
                    {comment.author.userName
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="taskCommentContent">
                    <div className="taskCommentTop">
                      <strong>
                        {comment.author.userName}
                      </strong>

                      <span>
                        {new Date(
                          comment.createAt
                        ).toLocaleString("ru-RU")}
                      </span>
                    </div>

                    <p>
                      {comment.text}
                    </p>
                  </div>

                  <button className="taskCommentMore">
                    <HiOutlineEllipsisHorizontal />
                  </button>
                </div>
              ))
            )}

            <div className="taskCommentInputWrapper">
              <div className="taskModalCurrentAvatar">
                АА
              </div>

              <input
                type="text"
                placeholder="Написать комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <button
                className="commentSendButton"
                onClick={handleCreateComment}
                disabled={commentSending || !commentText.trim()}
              >
                <HiOutlinePaperAirplane />

                {commentSending
                  ? "Отправка..."
                  : "Отправить"}
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
                {task.executorName
                  .slice(0, 2)
                  .toUpperCase()}
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
              {translateTaskType(task.type)}
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
        <div className="stageMoveWrapper">
          <button
            className="taskModalFooterButton"
            onClick={() => setIsStageMenuOpen(prev => !prev)}
          >
            <HiOutlineArrowsRightLeft />
            Переместить в другой этап
          </button>

          {isStageMenuOpen && (
            <div className="stageMoveMenu">
              {stagesLoading ? (
                <div className="stageMoveLoading">
                  Загрузка...
                </div>
              ) : (
                projectStages.map((stageItem) => (
                  <button
                    key={stageItem.id}
                    className="stageMoveItem"
                    onClick={() => handleStageChange(stageItem.id)}
                    disabled={stageItem.id === currentStageId}
                  >
                    {stageItem.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>


        <button className="taskModalDeleteButton"
          onClick={() => setIsDeleteConfirmOpen(true)}
        >
          <HiOutlineTrash />
          Удалить задачу
        </button>
      </div>
    </div>
    {isDeleteConfirmOpen && (
      <div
        className="deleteConfirmOverlay"
        onMouseDown={() => setIsDeleteConfirmOpen(false)}
      >
        <div
          className="deleteConfirmModal"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <h2>Удалить задачу?</h2>

          <p>
            Вы уверены, что хотите удалить задачу
            <strong> «{task.title}»</strong>?
            Это действие нельзя отменить.
          </p>

          <div className="deleteConfirmActions">
            <button
              className="deleteConfirmCancel"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={deleteLoading}
            >
              Отмена
            </button>

            <button
              className="deleteConfirmDelete"
              onClick={() => handleDeleteTask(task.id)}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Удаление..." : "Удалить"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
