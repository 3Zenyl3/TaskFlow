import type { ProjectDetails } from "../api/projects";
import { GetProject } from "../api/projects";
import { useEffect, useState } from "react";

export function useProjectInfo(projectId: number){
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadingProject(){
      try{
        const project = await GetProject(projectId);
        setProject(project);
      }
      catch(err){
        console.error(err);     
      }
      finally {
        setLoading(false);
      }
    }
    loadingProject();
  }, [projectId])
  return {
    project,
    loading
  }
}