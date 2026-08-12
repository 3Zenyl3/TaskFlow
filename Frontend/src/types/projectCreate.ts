export type ProjectColor = {
  name: string;
  value: string;
  background: string;
};


export type ProjectCreateData = {
  title: string;
  description: string;
  icon: string;
  key: string;
  category: string;
  color: ProjectColor;
  startDate: Date | null;
  deadline: Date | null;
  tags: string[];

  members: {
    email: string;
    role: string;
  }[];

  memberEmail: string;
  selectedMemberRole: string;
}