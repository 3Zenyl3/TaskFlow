import type { ProjectStage } from "../api/stages";
import { GetProjectStages } from "../api/stages";
import { useEffect, useState } from "react";

export function useProjectStages(projectId?: number) {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId === undefined || Number.isNaN(projectId)) {
      return;
    }
     const currentProjectId = projectId;

    async function loadStages() {
      try {
        setLoading(true);

        const stages = await GetProjectStages(currentProjectId);
        setStages(stages);
      } catch (err) {
        console.error("Не удалось загрузить этапы:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStages();
  }, [projectId]);

  return { stages, loading };
}