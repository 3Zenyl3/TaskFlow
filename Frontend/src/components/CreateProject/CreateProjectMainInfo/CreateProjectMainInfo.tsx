import "./CreateProjectMainInfo.css"
import { CreateProjectFormItem } from "../../Input/CreateProjectFormItem/CreateProjectFormItem";
import { Dropdown } from "../../Button/Dropdown";
import { HiCheck } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";
import { DatePickerInput } from "../../Input/DatePickerInput/DatePickerInput";
import type { ProjectCreateData } from "../../../types/projectCreate";


type Props = {
  projectData: ProjectCreateData;
  setProjectData: React.Dispatch<
    React.SetStateAction<ProjectCreateData>
  >;
};

export function CreateProjectMainInfo({
  projectData,
  setProjectData
}: Props) {
  const categories = [
    "Разработка",
    "Дизайн",
    "Мобильное приложение",
    "Маркетинг",
    "Тестирование",
    "Поддержка",
    "Обучение",
    "Внутренний"
  ];
  const roles = [
    "Участник",
    "Администратор",
    "Наблюдатель",
    "Владелец"
  ];
  const colors = [
    { name: "blue", value: "#3B82F6", background: "#EEF3FE" },
    { name: "green", value: "#22C55E", background: "#ECFDF3" },
    { name: "purple", value: "#A855F7", background: "#F7EEFE" },
    { name: "orange", value: "#F97316", background: "#FFF3EB" },
    { name: "red", value: "#EF4444", background: "#FEF0F0" },
    { name: "cyan", value: "#06B6D4", background: "#ECFBFE" },
    { name: "gray", value: "#6B7280", background: "#F3F4F6" }
  ];


  return (
    <div className="createProjectMainInfo">
      <h3 className="createProjectTitle">Основная информация</h3>
      <div className="createProjectTexts">
        <div className="createProjectTextsFirst">
          <CreateProjectFormItem
            title="Название проекта *"
            placeholder="Введите название проекта"
          />
          <CreateProjectFormItem
            title="Ключ проекта"
            placeholder="Например SHOP"
            description="Уникальный идентификатор для API и ID задач"
          />
        </div>
        <div className="createProjectFormItem">
          <h4 className="createProjectFormTitle">Описание проекта</h4>
          <textarea
            className="inputFieldMax"
            placeholder="Расскажите о целях и задачах проекта..."
          />
        </div>
      </div>
      <div className="createProjectSettings">
        <div className="settingsCategory">
          <h4 className="createProjectFormTitle">Категория</h4>
          <Dropdown
            title="Выберите категорию"
            value={projectData.category}
            options={categories}
            onChange={(value) =>
              setProjectData({
                ...projectData,
                category: value
              })
            }
          />
        </div>
        <div className="projectColorSetting">
          <h4 className="createProjectFormTitle">Цвет проекта</h4>
          <div className="colors">
            <div className="colorPicker">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`colorItem ${projectData.color.name === color.name ? "active" : ""}`}
                  style={{
                    backgroundColor: color.value,
                    "--color-background": color.background
                  } as React.CSSProperties}
                  onClick={() =>
                    setProjectData({
                      ...projectData,
                      color: color
                    })
                  }
                >{projectData.color.name === color.name && (
                  <HiCheck className="checkIcon" />
                )}</button>
              ))}
            </div>
          </div>
        </div>

      </div>
      <div className="timeSettingsProject">

        <div className="dateSetting">
          <h4 className="createProjectFormTitle">
            Дата начала
          </h4>
          <DatePickerInput />
        </div>
        <div className="dateSetting">
          <h4 className="createProjectFormTitle">
            Дедлайн <span>(необязательно)</span>
          </h4>
          <DatePickerInput />
        </div>
      </div>
      <div className="tagSettingsProject">
        <h4 className="createProjectFormTitle">Метки проекта</h4>
        <div className="tagsInSetting">
          <span>web</span>
          <span>e-commerce</span>
          <span>frontend</span>
          <button><HiPlus /> Добавить новую метку</button>
        </div>
      </div>
      <div className="addNewMembers">
        <h4 className="createProjectFormTitle">
          Пригласить участников <span>(необязательно)</span>
        </h4>
        <div className="formsAddUsers">
          <div className="addNewMemberEmail">
            <CreateProjectFormItem
              placeholder="Введите email пользователя"
            />
          </div>
          <div className="selectRoleNewMember">
            <Dropdown
              title="Роль"
              value={projectData.selectedMemberRole}
              options={roles}
              onChange={(value) =>
                setProjectData({
                  ...projectData,
                  selectedMemberRole: value
                })
              }
            />
          </div>
          <div className="addNewMemberButtonDiv">
            <button className="addNewMemberButton">Добавить</button>
          </div>
        </div>
      </div>
    </div>
  );
}