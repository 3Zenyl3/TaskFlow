import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineCalendar } from "react-icons/hi2";

import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";

import "./DatePickerInput.css";

registerLocale("ru", ru);

export function DatePickerInput() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      selected={date}
      onChange={(date: Date | null) => setDate(date)}
      locale="ru"
      dateFormat="dd.MM.yyyy"
      placeholderText="Выберите дату"
      popperPlacement="top-start"
      fixedHeight
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