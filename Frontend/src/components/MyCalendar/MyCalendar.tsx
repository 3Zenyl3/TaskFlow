import { useState } from "react";
import "./MyCalendar.css"
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiOutlineChevronRight } from "react-icons/hi";


type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  //tasks: Task[];
};

function getDaysInMonth(year: number, month: number) {
  const days: CalendarDay[] = [];
  const countMonthDay = new Date(year, month + 1, 0).getDate();
  let startMonthDay = new Date(year, month, 1).getDay();

  if (startMonthDay === 0) {
    startMonthDay = 6;
  } else {
    startMonthDay--;
  }
  for (let i = startMonthDay - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);

    days.push({
      date,
      isCurrentMonth: false,
      //tasks: []
    });
  }
  for (let i = 1; i <= countMonthDay; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  let remainingDays;
  if (days.length > 35)
    remainingDays = 42 - days.length;
  else
    remainingDays = 35 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      //tasks: []
    });
  }
  return days;
}

function isCurrentDate(day: CalendarDay, currentDate: Date) {
  return (
    day.date.getDate() === currentDate.getDate() &&
    day.date.getMonth() === currentDate.getMonth() &&
    day.date.getFullYear() === currentDate.getFullYear()
  );
}

function getDifferentMonth(isNextMonth: boolean, currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  let newMonth;
  if (isNextMonth) {
    newMonth = new Date(year, month + 1, 1)
  }
  else {
    newMonth = new Date(year, month - 1, 1)
  }
  return newMonth;
}

function MyCalendar() {
  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
  ];
  const today = new Date();
  const [calendarDate, setСalendarDate] = useState(new Date());
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const days = getDaysInMonth(year, month)
  return (
    <div className="myCalendar">
      <header className="calendarHeader">
        <h2 className="calendarTitle">Календарь</h2>
        <div className="navMonth">
          <button onClick={() => setСalendarDate(getDifferentMonth(false, calendarDate))}><HiOutlineChevronLeft /></button>
          <p>{months[calendarDate.getMonth()]} {calendarDate.getFullYear()}</p>
          <button onClick={() => setСalendarDate(getDifferentMonth(true, calendarDate))}><HiOutlineChevronRight /></button>
        </div>

      </header>

      <div className="daysName">
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>

      <div className="calendarGrid">
        {days.map((day, index) => (
          <div className={isCurrentDate(day, today) ? "today" : day.isCurrentMonth === false ? "prevMonthDay" : "day"} key={index}>
            {day?.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCalendar;