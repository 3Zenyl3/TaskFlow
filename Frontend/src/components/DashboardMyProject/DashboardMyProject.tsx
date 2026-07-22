import "./DashboardMyProject.css"
import Project from "../Project/Project";

function DashboardMyProject() {
  return (
    <div className="myProjects">
      <header className="myProjectsHeader">
        <h2 className="myProjectsTitle">Недавние проекты</h2>
      </header>
      <div className="myProjectsList">
        <Project
          title="Internet shop"
          description="Разработка иктернет-магазина с каталогом товаров и оплатой онлайн."
          percentProject="67%"
          countTask="24 задачи" />
        <Project
          title="Internet shop"
          description="Разработка иктернет-магазина с каталогом товаров и оплатой онлайн."
          percentProject="67%"
          countTask="24 задачи" />
        <Project
          title="Internet shop"
          description="Разработка иктернет-магазина с каталогом товаров и оплатой онлайн."
          percentProject="67%"
          countTask="24 задачи" />
        <Project
          title="Internet shop"
          description="Разработка иктернет-магазина с каталогом товаров и оплатой онлайн."
          percentProject="67%"
          countTask="24 задачи" />
        <Project
          title="Internet shop"
          description="Разработка иктернет-магазина с каталогом товаров и оплатой онлайн."
          percentProject="67%"
          countTask="24 задачи" />
        <Project
          title="Internet shop"
          description="Разработка иктернет-магазина с каталогом товаров и оплатой онлайн."
          percentProject="67%"
          countTask="24 задачи" />
      </div>
    </div>
  );
}

export default DashboardMyProject;