import { GetMyTask } from "../api/tasks";
import { useEffect, useState } from "react";
import type { ProjectTask } from "../api/projects";

export function useDashboardTasks(){
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks(){
      try{
        //const tasksFromLocalstorage = localStorage.getItem('tasks');
        //if(tasksFromLocalstorage){
        //  setTasks(JSON.parse(tasksFromLocalstorage));
        //}
        //else{
          const data = await GetMyTask();
          setTasks(data);
          localStorage.setItem('tasks', JSON.stringify(data));
        //}      
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
