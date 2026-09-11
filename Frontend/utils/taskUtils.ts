export function getPriorityName(priority: string) {
  switch (priority) {
    case "Low":
      return "Низкий";
    case "Medium":
      return "Средний";
    case "High":
      return "Высокий";
    case "Critical":
      return "Критический";
    default:
      return priority;
  }
}

export function getStatusName(status: string) {
  switch (status) {
    case "InProgress":
      return "В работе";
    case "Todo":
      return "Нужно сделать";
    case "Review":
      return "Ревью";
    case "Done":
      return "Выполнена";
    case "Postponed":
      return "Отложена";
    default:
      return status;
  }
}