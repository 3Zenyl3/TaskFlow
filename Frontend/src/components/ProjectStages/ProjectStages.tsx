import "./ProjectStages.css";
import type { ProjectStage } from "../../api/stages";
import { useState } from "react";
import CreateStageModal from "../CreateStageModal/CreateStageModal";
import { CreateProjectStage } from "../../api/stages";
import {
  HiOutlineGlobeAlt,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCodeBracket,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";

type ProjectStagesProps = {
  projectId: number;
  stages: ProjectStage[];
  onStageClick?: (stage: ProjectStage) => void;
  onStageMenuClick?: (stage: ProjectStage) => void;
  loading: boolean;
};

export default function ProjectStages({
  projectId,
  stages,
  onStageClick,
  onStageMenuClick,
  loading
}: ProjectStagesProps) {
  const [isCreateStageOpen, setIsCreateStageOpen] = useState(false);
  const getProgress = (stage: ProjectStage) => {
    if (stage.totalTasks === 0) {
      return 0;
    }

    return Math.round(
      (stage.completedTasks / stage.totalTasks) * 100
    );
  };
  const stageIcons = {
    globe: HiOutlineGlobeAlt,
    home: HiOutlineHome,
    briefcase: HiOutlineBriefcase,
    code: HiOutlineCodeBracket,
    rocket: HiOutlineRocketLaunch,
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="projectStages">
      <div className="projectStages__header">
        <div className="projectStages__titleWrapper">
          <h2 className="projectStages__title">
            Этапы проекта
          </h2>
        </div>

        <button
          className="projectStages__createButton"
          onClick={() => setIsCreateStageOpen(true)}
        >
          <span className="projectStages__plus">+</span>
          Создать этап
        </button>
      </div>

      <div className="projectStages__table">
        <div className="projectStages__tableHeader">
          <div>Этап</div>
          <div>Задачи</div>
          <div>Прогресс</div>
          <div>Сроки</div>
          <div></div>
        </div>
        {loading ? (
          <div>Загрузка этапов...</div>
        ) :
          stages.length === 0 ? (
            <div className="projectStages__empty">
              <div className="projectStages__emptyTitle">
                В проекте пока нет этапов
              </div>

              <div className="projectStages__emptyText">
                Создайте первый этап, чтобы организовать работу над проектом
              </div>

              <button
                className="projectStages__emptyButton"
                onClick={() => setIsCreateStageOpen(true)}
              >
                Создать первый этап
              </button>
            </div>
          ) : (
            stages.map((stage) => {
              const progress = getProgress(stage);
              const StageIcon =
                stageIcons[stage.icon as keyof typeof stageIcons]
                ?? HiOutlineBriefcase;

              return (
                <div
                  className="projectStages__row"
                  key={stage.id}
                  onClick={() => onStageClick?.(stage)}
                >
                  <div className="projectStages__stage">
                    <div
                      className="projectStages__icon"
                      style={{
                        backgroundColor: stage.colorStage?.background ?? "#e8f3ff",
                        color: stage.colorStage?.value ?? "#3484ef"
                      }}
                    >
                      <StageIcon className="projectStages__iconIco" />
                    </div>

                    <span className="projectStages__stageName">
                      {stage.name}
                    </span>
                  </div>

                  <div className="projectStages__tasks">
                    {stage.completedTasks} / {stage.totalTasks}
                  </div>

                  <div className="projectStages__progress">
                    <div className="projectStages__progressBar">
                      <div
                        className="projectStages__progressValue"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <span className="projectStages__progressPercent">
                      {progress}%
                    </span>
                  </div>

                  <div className="projectStages__dates">
                    <span>
                      {formatDate(stage.startDate)}
                    </span>

                    <span className="projectStages__dateSeparator">
                      →
                    </span>

                    <span>
                      {formatDate(stage.endDate)}
                    </span>
                  </div>

                  <button
                    className="projectStages__menu"
                    onClick={(event) => {
                      event.stopPropagation();
                      onStageMenuClick?.(stage);
                    }}
                  >
                    •••
                  </button>
                </div>
              );
            })
          )}
      </div>
      {isCreateStageOpen && (
        <CreateStageModal
          onClose={() => setIsCreateStageOpen(false)}
          onCreate={async (data) => {
            await CreateProjectStage(
              projectId,
              data.name,
              data.icon,
              data.color,
              data.startDate!,
              data.description,
              data.endDate ?? undefined
            );

            setIsCreateStageOpen(false);
          }}
        />
      )}
    </section>

  );
}