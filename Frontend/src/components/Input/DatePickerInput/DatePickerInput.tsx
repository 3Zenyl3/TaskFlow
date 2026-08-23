import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineCalendar } from "react-icons/hi2";

import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";

import "./DatePickerInput.css";

registerLocale("ru", ru);

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
};

export function DatePickerInput({
  value,
  onChange,
  error
}: Props) {

  return (
    <div>
      <DatePicker
        selected={value}
        onChange={onChange}
        locale="ru"
        dateFormat="dd.MM.yyyy"
        placeholderText="Выберите дату"
        popperPlacement="top-start"
        fixedHeight
        portalId="datepicker-portal"
        customInput={
          <div className={`dateInput ${value ? "selectedDate" : ""}`}>
            <HiOutlineCalendar className="calendarIcon" />

            <span>
              {value
                ? value.toLocaleDateString("ru-RU")
                : "Выберите дату"}
            </span>
          </div>
        }
      />

      {error && (
        <p className="inputErrorText">
          {error}
        </p>
      )}
    </div>
  );
}