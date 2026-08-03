import "./ProjectFiles.css"
import { HiOutlineDocumentText, HiOutlineArrowDownTray } from "react-icons/hi2";

export function ProjectFile() {
  return (
    <div className="ProjectFile">
      <header className="projectFilesHeader">
        <h3 className="projectFilesTitle">Файлы проекта</h3>
        <button className="seeAllFile">Смотреть все</button>
      </header>
      <div className="file" >
        <div className="fileContent">
          <div className="filePng"><span className="icon"><HiOutlineDocumentText /></span></div>
          <div className="fileInfo">
            <h4 className="fileName">Техническое задание.pdf</h4>
            <div className="fileDetails" >
              <span className="fileType">PDF</span>
              <span className="fileSize">2.4MB</span>
              <span className="fileDate">16 июл 2026</span>
            </div>
          </div>
        </div>
        <div className="downloadIcon"><HiOutlineArrowDownTray /></div>
      </div>
    </div>
  );
}