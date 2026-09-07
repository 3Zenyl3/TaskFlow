import type { ProjectDetails } from "../api/projects";
import { GetProject } from "../api/projects";
import { useEffect, useState } from "react";

export function useProjectInfo(projectId?: number) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId || Number.isNaN(projectId)) {
      return;
    }

    const loadingProject = async () => {
      try {
        setLoading(true);

        const data = await GetProject(projectId);
        setProject(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadingProject();
  }, [projectId]);

  return {
    project,
    loading,
  };
}