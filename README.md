# TaskFlow http://135.106.210.189:3000/TaskFlow/register

TaskFlow — это веб-приложение для управления задачами и проектами, разработанное в качестве pet-проекта. Пользователи могут создавать проекты, управлять задачами, отслеживать их статус и работать в команде.

## Возможности

- Регистрация и авторизация пользователей (JWT)
- Создание и управление проектами
- Создание, редактирование и удаление задач
- Назначение исполнителей
- Отслеживание статуса и приоритета задач
- Личный дашборд с задачами
- Статистика и аналитика

## Технологии

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios

## Запуск проекта

### Backend

```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Статус проекта

🚧 Проект развернут на сервере, фиксятся последние баги. Разрабатывается дополнительный функционал
