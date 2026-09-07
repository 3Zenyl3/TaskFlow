import type { ProjectStage } from "../api/stages";
import { GetCurrentProjectStage } from "../api/stages";
import { useEffect, useState } from "react";

export function useCurrentProjectStages(
  projectId?: number,
  stageId?: number
) {
  const [stage, setStage] = useState<ProjectStage>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      projectId === undefined ||
      stageId === undefined ||
      Number.isNaN(projectId) ||
      Number.isNaN(stageId)
    ) {
      return;
    }

    const currentProjectId = projectId;
    const currentStageId = stageId;

    async function loadStage() {
      try {
        setLoading(true);

        const stage = await GetCurrentProjectStage(
          currentProjectId,
          currentStageId
        );

        setStage(stage);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStage();
  }, [projectId, stageId]);

  return { stage, loading };
}