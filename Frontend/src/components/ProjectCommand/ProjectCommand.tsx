import "./ProjectCommand.css"
import type { ProjectMemberDto, UserDto } from "../../api/projects";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

type Props = {
  owner: UserDto;
  members: ProjectMemberDto[];
};
export function ProjectCommand({ owner, members }: Props) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="projectCommand">
      <header className="projectCommandHeader">
        <h3 className="projectCommandTitle">Участники проекта</h3>
        <button onClick={() => navigate(`/dashboard/project/${id}/edit`)} className="addNewMember">Пригласить</button>
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
            key={member.userDto.userId}
            src={member.userDto.avatarUrl}
            alt={member.userDto.userName}
            className="peopleAvatarInProjectCom"
          />
        ))}
      </div>
    </div>
  );
}