import { GetProjects } from "../api/projects";
import { useEffect, useState } from "react";
import type { Project } from "../api/projects";

export function useDashboardProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadingProject() {
      try {
        const projects = await GetProjects();
        setProjects(projects);
      }
      catch (err) {
        console.error(err);
      }
      finally {
        setLoading(false);
      }
    }
    loadingProject();
  }, [])
  return {
    projects,
    loading
  };
}
