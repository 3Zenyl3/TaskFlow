import { GetProfile } from "../api/profile";
import { GetNotification } from "../api/notifications"; 
import { useEffect } from "react";
import { useState } from "react";
import type { Notification } from "../api/notifications";

export function useDashboardHeader() {
  const [userName, setUserName] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const savedProfile = localStorage.getItem("profile");
        const savedNotifications = localStorage.getItem("notifications");

        if (savedProfile && savedNotifications) {
          const profile = JSON.parse(savedProfile);
          const notifications: Notification[] = JSON.parse(savedNotifications);

          setUserName(profile.userName);
          setNotificationCount(
                    notifications.filter(n => !n.isRead).length
                );
        }
        else{
          const [profile, notifications] = await Promise.all([
          GetProfile(), GetNotification()
        ]);
        
        setUserName(profile.userName);
        setNotificationCount(
                    notifications.filter(n => !n.isRead).length
                );
        localStorage.setItem("profile", JSON.stringify(profile));
        localStorage.setItem("notifications", JSON.stringify(notifications));
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, []);
  return { userName, notificationCount };
}