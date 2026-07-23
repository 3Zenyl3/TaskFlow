import { GetMyTask } from "../api/tasks";
import { useEffect, useState } from "react";
import type { Task } from "../api/tasks";

export function useDashboardTasks(){
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks(){
      try{
        const data = await GetMyTask();
        setTasks(data);
      }
      catch(err){
        console.error(err);
      }
      finally{
        setLoading(false);
      }
    }
    loadTasks();
  }, [])
  return {
        tasks,
        loading
    };
}
