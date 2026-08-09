export type ProjectColor = {
  name: string;
  value: string;
  background: string;
};


export type ProjectCreateData = {
  title: string;
  description: string;
  category: string;
  color: ProjectColor;
  startDate: Date | null;
  deadline: Date | null;
  tags: string[];

  members: {
    email: string;
    role: string;
  }[];

  selectedMemberRole: string;
}