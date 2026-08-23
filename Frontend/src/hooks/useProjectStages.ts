import type { ProjectStage } from "../api/stages";
import { GetProjectStages } from "../api/stages";
import { useEffect, useState } from "react";

export function useProjectStages(projectId: number) {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStages() {
      try {
        const stages = await GetProjectStages(projectId);
        setStages(stages);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
      finally {
        setLoading(false);
      }
    }
    loadStages();
  }, [projectId])
  return { stages, loading };
}