import { GetProfile } from "../api/profile";
import { GetNotification } from "../api/notifications"; 
import { useEffect } from "react";
import { useState } from "react";

export function useDashboardHeader() {
  const [userName, setUserName] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [profile, notifications] = await Promise.all([
          GetProfile(), GetNotification()
        ]);
        
        setUserName(profile.userName);
        setNotificationCount(
                    notifications.filter(n => !n.isRead).length
                );
      }
      catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, []);
  return { userName, notificationCount };
}