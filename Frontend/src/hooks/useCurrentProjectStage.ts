import type { ProjectStage } from "../api/stages";
import { GetCurrentProjectStage } from "../api/stages";
import { useEffect, useState } from "react";

export function useCurrentProjectStages(projectId: number, stageId: number) {
  const [stage, setStages] = useState<ProjectStage>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStages() {
      try {
        const stage = await GetCurrentProjectStage(projectId, stageId);
        setStages(stage);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
      finally {
        setLoading(false);
      }
    }
    loadStages();
  }, [projectId, stageId])
  return { stage, loading };
}