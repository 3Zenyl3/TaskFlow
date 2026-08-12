import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineCalendar } from "react-icons/hi2";

import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";
import type { ProjectCreateData } from "../../../types/projectCreate";
import "./DatePickerInput.css";

registerLocale("ru", ru);
type Props = {
  projectData: ProjectCreateData;
  setProjectData: React.Dispatch<
    React.SetStateAction<ProjectCreateData>
  >;
  field: "startDate" | "deadline";
};

export function DatePickerInput({ projectData, setProjectData, field }: Props) {
  const date = projectData[field];

  return (
    <DatePicker
      selected={date}
      onChange={(date: Date | null) => {
        setProjectData(prev => ({
          ...prev,
          [field]: date
        }));
      }}
      locale="ru"
      dateFormat="dd.MM.yyyy"
      placeholderText="Выберите дату"
      popperPlacement="top-start"
      fixedHeight
      portalId="datepicker-portal"
      customInput={
        <div className={`dateInput ${date ? "selectedDate" : ""}`}>
          <HiOutlineCalendar className="calendarIcon" />
          <span>
            {date
              ? date.toLocaleDateString("ru-RU")
              : "Выберите дату"}
          </span>
        </div>
      }
    />
  );
}