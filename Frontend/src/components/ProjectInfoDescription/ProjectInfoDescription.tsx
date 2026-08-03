import "./ProjectInfoDescription.css"
import { HiOutlineMapPin, HiOutlineCalendar, HiOutlineCalendarDateRange, HiOutlineTag, HiOutlineHashtag} from "react-icons/hi2";

export function ProjectInfoDescription() {
  return (
    <div className="projectInfoDescription">
      <h3 className="projectInfoDescriptionTitle">О проекте</h3>
      <div><p className="infoDescriptionTitle"><HiOutlineMapPin />Владелец</p></div>
      <div><p className="infoDescriptionTitle"><HiOutlineCalendar />Создан</p></div>
      <div><p className="infoDescriptionTitle"><HiOutlineCalendarDateRange />Дедлайн</p></div>
      <div><p className="infoDescriptionTitle"><HiOutlineTag />Категория</p></div>
      <div><p className="infoDescriptionTitle"><HiOutlineHashtag />Метки</p></div>
      <div className="projectDescriptionInfo">
        <p className="infoDescriptionTitle">Описание</p>
        <p>Интернет-магазин с каталогом товаров,
            корзиной и системой онлайн-оплаты.</p>
        </div>
    </div>
  );
}