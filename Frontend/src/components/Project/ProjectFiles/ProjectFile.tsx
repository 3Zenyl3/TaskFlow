import "./ProjectFiles.css"
import { HiOutlineDocumentText, HiOutlineArrowDownTray } from "react-icons/hi2";
import type { ProjectFileDTO } from "../../../api/projects";
import { useRef, useState } from "react";
import { UploadProjectFile, DownloadProjectFile } from "../../../api/projects";


type Props = {
  projectId: number;
  files: ProjectFileDTO[];
};

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} Б`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} КБ`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
}
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function getFileType(fileName: string) {
  const extension = fileName.split(".").pop()?.toUpperCase();

  return extension || "FILE";
}

export function ProjectFile({ projectId, files }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectFiles, setProjectFiles] = useState<ProjectFileDTO[]>(files);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const uploadedFile = await UploadProjectFile(projectId, file);

      setProjectFiles(prev => [...prev, uploadedFile]);
    } catch (error) {
      console.error(error);
    }

    event.target.value = "";
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const response = await DownloadProjectFile(projectId, fileId);

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };
  function truncateFileName(fileName: string, maxLength = 35) {
    if (fileName.length <= maxLength) {
      return fileName;
    }

    return fileName.slice(0, maxLength - 3) + "...";
  }
  return (
    <div className="ProjectFile">
      <header className="projectFilesHeader">
        <div className="projectFilesTitleWrapper">
          <h3 className="projectFilesTitle">Файлы проекта</h3>

          <button
            className="addFileButton"
            onClick={() => fileInputRef.current?.click()}
          >
            +
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </div>
        <button className="seeAllFile">Смотреть все</button>
      </header>
      <div className="projectFilesList">
        {projectFiles.map(file => (
          <div className="file" key={file.id}>
            <div className="fileContent">
              <div className="filePng"><span className="icon"><HiOutlineDocumentText /></span></div>
              <div className="fileInfo">
                <h4 className="fileName">{truncateFileName(file.fileName)}</h4>
                <div className="fileDetails" >
                  <span className="fileType">{getFileType(file.fileName)}</span>
                  <span className="fileSize">{formatFileSize(file.size)}</span>
                  <span className="fileDate">{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            </div>
            <button
              className="downloadIcon"
              onClick={() => handleDownload(file.id, file.fileName)}
            >
              <HiOutlineArrowDownTray />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}