import "./ProjectCommand.css"
import type { UserDto } from "../../api/projects";

type Props = {
  members: UserDto[];
};
export function ProjectCommand({ members }: Props) {
  return (
    <div className="projectCommand">
      <header className="projectCommandHeader">
        <h3 className="projectCommandTitle">Участники проекта</h3>
        <button className="addNewMember">Пригласить</button>
      </header>
      <div className="peopleAvatarInProjectComDiv">
        {members.map(member => (
          <img
            key={member.userId}
            src={member.avatarUrl}
            alt={member.userName}
            className="peopleAvatarInProjectCom"
          />
        ))}
      </div>
    </div>
  );
}