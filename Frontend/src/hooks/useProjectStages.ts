import type { ProjectStage } from "../api/stages";
import { GetProjectStages } from "../api/stages";
import { useCallback, useEffect, useState } from "react";

export function useProjectStages(projectId?: number) {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStages = useCallback(async () => {
    if (!projectId || Number.isNaN(projectId)) {
      return;
    }

    try {
      setLoading(true);

      const data = await GetProjectStages(projectId);
      setStages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStages();
  }, [loadStages]);

  return { stages, loading, refetchStages: loadStages, };
}