import { GetProfile, type Profile } from "../api/profile";
import { useEffect, useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);
      const data = await GetProfile();
      setProfile(data);
    } catch {
      setError("Не удалось загрузить профиль");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const fetchProfile = async () => {
      await loadProfile();
    };

    fetchProfile();
  }, []);
  return {
    profile,
    loading,
    error,
    refetch: loadProfile
  };
}