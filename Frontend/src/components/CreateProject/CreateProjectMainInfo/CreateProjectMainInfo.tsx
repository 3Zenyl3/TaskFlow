import "./CreateProjectMainInfo.css"
import { CreateFormItem } from "../../Input/CreateProjectFormItem/CreateProjectFormItem";
import { Dropdown } from "../../Button/Dropdown";
import { HiCheck } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";
import { DatePickerInput } from "../../Input/DatePickerInput/DatePickerInput";
import type { ProjectCreateData } from "../../../types/projectCreate";
import { useState } from "react";


type Props = {
  projectData: ProjectCreateData;
  setProjectData: React.Dispatch<
    React.SetStateAction<ProjectCreateData>
  >;
  errors: {
    title: string;
    key: string;
    category: string;
    startDate: string;
    deadline: string;
  };
};

export function CreateProjectMainInfo({
  projectData,
  setProjectData,
  errors
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

  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const handleAddMember = () => {
    if (!projectData.memberEmail.trim()) {
      return;
    }

    setProjectData(prev => ({
      ...prev,
      members: [
        ...prev.members,
        {
          email: prev.memberEmail.trim(),
          role: prev.selectedMemberRole
        }
      ],
      memberEmail: ""
    }));
  };

  return (
    <div className="createProjectMainInfo">
      <h3 className="createProjectTitle">Основная информация</h3>
      <div className="createProjectTexts">
        <div className="createProjectTextsFirst">
          <CreateFormItem
            title="Название проекта"
            placeholder="Введите название проекта"
            error={errors.title}
            field="title"
            data={projectData}
            setData={setProjectData}
          />
          <CreateFormItem
            title="Ключ проекта"
            placeholder="Например SHOP"
            error={errors.key}
            description="Уникальный идентификатор для API и ID задач"
            field="key"
            data={projectData}
            setData={setProjectData}
          />
        </div>
        <div className="createProjectFormItem">
          <h4 className="createProjectFormTitle">Описание проекта</h4>
          <textarea
            className="inputFieldMax"
            placeholder="Расскажите о целях и задачах проекта..."
            value={projectData.description}
            onChange={(e) =>
              setProjectData(prev => ({
                ...prev,
                description: e.target.value
              }))
            }
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
            error={errors.category}
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
          <DatePickerInput
            value={projectData.startDate}
            onChange={(date) =>
              setProjectData(prev => ({
                ...prev,
                startDate: date
              }))
            }
            error={errors.startDate}
          />
        </div>
        <div className="dateSetting">
          <h4 className="createProjectFormTitle">
            Дедлайн <span>(необязательно)</span>
          </h4>
          <DatePickerInput
            value={projectData.deadline}
            onChange={(date) =>
              setProjectData(prev => ({
                ...prev,
                deadline: date
              }))
            }
            error={errors.deadline}
          />
        </div>
      </div>
      <div className="tagSettingsProject">
        <h4 className="createProjectFormTitle">Метки проекта</h4>
        <div className="tagsInSetting">
          {projectData.tags.map((tag, index) => (
            <span
              key={index}>{tag}
              <button className="deleteTagButton"
                onClick={() => {
                  setProjectData(prev => ({
                    ...prev,
                    tags: prev.tags.filter((_, i) => i !== index)
                  }));
                }}
              >
                ×
              </button>
            </span>
          ))}
          {isAddingTag && (
            <input className="addNewTag"
              type="text"
              value={newTag}
              placeholder="Название метки"
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!newTag.trim()) return;

                  setProjectData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag.trim()]
                  }));

                  setNewTag("");
                  setIsAddingTag(false);
                }
              }}
            />
          )}
          <button onClick={() => setIsAddingTag(true)} className="addTagButton">
            <HiPlus /> Добавить новую метку
          </button>
        </div>
      </div>
      <div className="addNewMembers">
        <h4 className="createProjectFormTitle">
          Пригласить участников <span>(необязательно)</span>
        </h4>
        <div className="formsAddUsers">
          <div className="addNewMemberEmail">
            <CreateFormItem
              placeholder="Введите email пользователя"
              field="memberEmail"
              data={projectData}
              setData={setProjectData}
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
            <button className="addNewMemberButton" onClick={handleAddMember}>Добавить</button>
          </div>
        </div>
        <div className="membersList">
          {projectData.members.map((member, index) => (
            <div key={index} className="memberItem">
              <span>{member.email}</span>
              <span>{member.role}</span>

              <button
                onClick={() => {
                  setProjectData(prev => ({
                    ...prev,
                    members: prev.members.filter((_, i) => i !== index)
                  }));
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}