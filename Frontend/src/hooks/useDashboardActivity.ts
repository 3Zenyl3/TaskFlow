import { getTeamActivity } from "../api/teamActivity";
import type { Activity } from "../api/teamActivity";
import { useState, useEffect } from "react";

export function useDashboardActivity() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadActivity() {
      try {
        //const activityFromLocalStorage = localStorage.getItem('activity');
        //if(activityFromLocalStorage){
        //  setActivity(JSON.parse(activityFromLocalStorage));
        //}
        //else{
          const activity = await getTeamActivity();
          setActivity(activity);
          localStorage.setItem('activity', JSON.stringify(activity));
       // }
      }
      catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadActivity()
  }, [])
  return {
    activity,
    loading
  };
}

