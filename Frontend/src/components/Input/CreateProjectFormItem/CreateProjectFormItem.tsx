import "./CreateProjectFormItem.css"

interface CreateProjectRightSideProps {
  title?: string;
  placeholder: string;
  description?: string;
}

export function CreateProjectFormItem({ title, placeholder, description }: CreateProjectRightSideProps) {
  return (
    <div className="createProjectFormItem">
      <h4 className="createProjectFormTitle">{title}</h4>
      <input type="text" className="inputFieldMini" placeholder={placeholder}></input>
      <p className="keyProjectDescription">{description}</p>
    </div>
  );
}