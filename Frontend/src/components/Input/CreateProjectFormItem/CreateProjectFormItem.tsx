import "./CreateProjectFormItem.css"
import type { ProjectCreateData } from "../../../types/projectCreate";

interface CreateProjectRightSideProps {
  title?: string;
  placeholder: string;
  description?: string;
  projectData: ProjectCreateData;
  setProjectData: React.Dispatch<
    React.SetStateAction<ProjectCreateData>
  >;
  form: "title" | "key" | "memberEmail";
}

export function CreateProjectFormItem({ title, placeholder, description, projectData, setProjectData, form }: CreateProjectRightSideProps) {
  return (
    <div className="createProjectFormItem">
      <h4 className="createProjectFormTitle">{title}</h4>
      <input
        type="text"
        className="inputFieldMini"
        placeholder={placeholder}
        value={projectData[form]}
        onChange={(e) =>
          setProjectData(prev => ({
            ...prev,
            [form]: e.target.value
          }))
        }
      />
      <p className="keyProjectDescription">{description}</p>
    </div>
  );
}