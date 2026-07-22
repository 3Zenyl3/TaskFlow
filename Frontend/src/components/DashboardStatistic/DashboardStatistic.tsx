import "./DashboardStatistic.css"
import {
  HiOutlineClock, HiOutlineClipboardCheck, HiOutlineClipboardList, HiOutlineExclamation,
} from "react-icons/hi";
import StatisticCard from "../../components/StatisticCard/StatisticCard";

function DashboardStatistic() {
  return (
    <div className="statistic">
      <div className="statisticHeader">
        <h2 className="statisticTitle">Статистика</h2>
        <div className="dropDownButton">
          <button className="dropButton">Текущая неделя <span className="arrow">▼</span></button>
          <div className="dropdownContent">
            <a href="#">Текущий месяц</a>
            <a href="#">Прошлая неделя</a>
            <a href="#">Прошлый месяц</a>
          </div>
        </div>
      </div>
      <div className="statisticsInfo">
        <div className="firstLineStatistic">
          <StatisticCard
            title="Всего задач"
            count="24"
            backgroundColor="#f6f9fe"
            color="#287dfc"
            emoji={HiOutlineClipboardList}
          />
          <StatisticCard
            title="Выполнено"
            count="18"
            backgroundColor="#f6faf9"
            color="#08a368"
            emoji={HiOutlineClipboardCheck}
          />
        </div>
        <div className="secondLineStatistic">
          <StatisticCard
            title="В работе"
            count="6"
            backgroundColor="#fef9f5"
            color="#fd8b01"
            emoji={HiOutlineClock}
          />
          <StatisticCard
            title="Просрочено"
            count="2"
            backgroundColor="#fcf5f5"
            color="#f91d1d"
            emoji={HiOutlineExclamation}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardStatistic;