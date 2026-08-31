import "./CreateProjectFormItem.css"

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];
interface CreateFormItemProps<T> {
  title?: string;
  placeholder: string;
  description?: string;
  error?: string;

  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;

  field: StringKeys<T>;
}

export function CreateFormItem<T>({
  title,
  placeholder,
  description,
  error,
  data,
  setData,
  field,
}: CreateFormItemProps<T>) {
  return (
    <div className="createProjectFormItem">
      <h4 className="createProjectFormTitle">{title}</h4>

      <div className="inputWrapper">
        <input
          type="text"
          className="inputFieldMini"
          placeholder={placeholder}
          value={data[field] as string}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              [field]: e.target.value,
            }))
          }
        />

        {error && <p className="inputErrorText">{error}</p>}
      </div>

      <p className="keyProjectDescription">{description}</p>
    </div>
  );
}