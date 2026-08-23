import { useState } from "react";
import { HiCheck } from "react-icons/hi";
import { DatePickerInput } from "../Input/DatePickerInput/DatePickerInput";
import type { ProjectColor } from "../../types/projectCreate";
import "./CreateStageModal.css";
import {
  HiOutlineGlobeAlt,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCodeBracket,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";

type ProjectStageCreateData = {
  name: string;
  description: string;
  icon: string;
  color: ProjectColor;
  startDate: Date | null;
  endDate: Date | null;
};

type CreateStageModalProps = {
  onClose: () => void;
  onCreate: (data: ProjectStageCreateData) => void;
};

export default function CreateStageModal({
  onClose,
  onCreate,
}: CreateStageModalProps) {

  const colors: ProjectColor[] = [
    { name: "blue", value: "#3B82F6", background: "#EEF3FE" },
    { name: "green", value: "#22C55E", background: "#ECFDF3" },
    { name: "purple", value: "#A855F7", background: "#F7EEFE" },
    { name: "orange", value: "#F97316", background: "#FFF3EB" },
    { name: "red", value: "#EF4444", background: "#FEF0F0" },
    { name: "cyan", value: "#06B6D4", background: "#ECFBFE" },
    { name: "gray", value: "#6B7280", background: "#F3F4F6" }
  ];
  const stageIcons = [
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


  const [stageData, setStageData] =
    useState<ProjectStageCreateData>({
      name: "",
      description: "",
      icon: "○",
      color: colors[0],
      startDate: null,
      endDate: null,
    });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!stageData.name.trim()) {
      return;
    }

    onCreate({
      ...stageData,
      name: stageData.name.trim(),
      description: stageData.description.trim(),
    });
  };

  return (
    <div
      className="createStageModal__overlay"
      onClick={onClose}
    >
      <form
        className="createStageModal"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="createStageModal__title">
          Создание этапа
        </h2>

        <div className="createStageMainInfo">

          <div className="createStageFormItem">
            <h4 className="createStageFormTitle">
              Название этапа
            </h4>

            <input
              className="inputFieldMax"
              type="text"
              placeholder="Например, Разработка"
              value={stageData.name}
              onChange={(event) =>
                setStageData(prev => ({
                  ...prev,
                  name: event.target.value
                }))
              }
            />
          </div>

          <div className="createStageFormItem">
            <h4 className="createStageFormTitle">
              Описание этапа
            </h4>

            <textarea
              className="inputFieldMax"
              placeholder="Опишите, что входит в этот этап..."
              value={stageData.description}
              onChange={(event) =>
                setStageData(prev => ({
                  ...prev,
                  description: event.target.value
                }))
              }
            />
          </div>

          <div className="createStageSettings">

            <div className="stageSetting">
              <h4 className="createStageFormTitle">
                Иконка
              </h4>

              <div className="stageIcons">
                {stageIcons.map(({ name, component: Icon }) => (
                  <button
                    type="button"
                    key={name}
                    className={`stageIconItem ${stageData.icon === name ? "active" : ""
                      }`}
                    onClick={() =>
                      setStageData(prev => ({
                        ...prev,
                        icon: name
                      }))
                    }
                  >
                    <Icon />
                  </button>
                ))}
              </div>
            </div>

            <div className="stageSetting">
              <h4 className="createStageFormTitle">
                Цвет этапа
              </h4>

              <div className="colorPicker">
                {colors.map(color => (
                  <button
                    type="button"
                    key={color.name}
                    className={
                      `colorItem ${stageData.color.name === color.name
                        ? "active"
                        : ""
                      }`
                    }
                    style={{
                      backgroundColor: color.value,
                      "--color-background": color.background
                    } as React.CSSProperties}
                    onClick={() =>
                      setStageData(prev => ({
                        ...prev,
                        color
                      }))
                    }
                  >
                    {stageData.color.name === color.name && (
                      <HiCheck className="checkIcon" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="timeSettingsStage">

            <div className="dateSetting">
              <h4 className="createStageFormTitle">
                Дата начала
              </h4>
              <DatePickerInput
                value={stageData.startDate}
                onChange={(date) =>
                  setStageData(prev => ({
                    ...prev,
                    startDate: date
                  }))
                }
              />
            </div>

            <div className="dateSetting">
              <h4 className="createStageFormTitle">
                Дедлайн <span>(необязательно)</span>
              </h4>
              <DatePickerInput
                value={stageData.endDate}
                onChange={(date) =>
                  setStageData(prev => ({
                    ...prev,
                    endDate: date
                  }))
                }
              />
            </div>

          </div>

        </div>

        <div className="createStageModal__actions">
          <button
            type="button"
            onClick={onClose}
          >
            Отмена
          </button>

          <button
            type="submit"
            disabled={!stageData.name.trim()}
          >
            Создать
          </button>
        </div>

      </form>
    </div>
  );
}