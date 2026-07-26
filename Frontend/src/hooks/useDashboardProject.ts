import { GetProjects } from "../api/projects";
import { useEffect, useState } from "react";
import type { Project } from "../api/projects";

export function useDashboardProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadingProject() {
      try {
        const cachedProjects = localStorage.getItem('projects');
        if (cachedProjects) {
          setProjects(JSON.parse(cachedProjects));
        }
        else {
          const projects = await GetProjects();
          setProjects(projects);
          localStorage.setItem('projects', JSON.stringify(projects));
        }
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
