import "./ProjectCommand.css"
import type { UserDto } from "../../api/projects";

type Props = {
  owner: UserDto;
  members: UserDto[];
};
export function ProjectCommand({ owner, members }: Props) {
  return (
    <div className="projectCommand">
      <header className="projectCommandHeader">
        <h3 className="projectCommandTitle">Участники проекта</h3>
        <button className="addNewMember">Пригласить</button>
      </header>
      <div className="peopleAvatarInProjectComDiv">
        <img
          key={owner.userId}
          src={owner.avatarUrl}
          alt={owner.userName}
          className="peopleAvatarInProjectCom"
        />
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