import "./DashboardTeamActivity.css"
import PeopleActivity from "../PeopeleActivity/PeopeleActivity";

function DashboardTeamActivity() {
  return (
    <div className="teamActivity">
      <div className="titleTeamActivity">
        <h2>Активность команды</h2>
        <a href="#" className="seeAllTeamActivity">Смотреть все</a>
      </div>
      <div className="peopleActivitys">
        <PeopleActivity
          src="https://sun9-29.vkuserphoto.ru/s/v1/ig2/jrQp8-hzwnXExoCQTDQ-e4Dhz7ENxdqGkInRZN9Cm4LzJsru6dVJZBoC328O2QUNd5RHFrP8HoyjJoq5DDilgyzN.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x426,360x640,480x853,540x959,640x1137,720x1279,1080x1919,1280x2274,1440x2558,1441x2560&from=bu&u=i-O_d0MUKW3zlwE5XelZaIdBNKithesH4n2LL2c03wo&cs=1441x0"
          name="Кирилл Кузнецов"
          description={'добавил комментарий к задаче "Создать дизайн"'}
          time="10:49"
        />
      </div>
    </div>
  );
}

export default DashboardTeamActivity;
