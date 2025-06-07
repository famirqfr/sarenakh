export interface Team {
  id: string;
  name: string;
  points: number;
  status: "ACTIVE" | "LEFT";
  leader: {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    age?: number;
  };
  members: {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    age: number;
    relation: string;
  }[];
}

export interface MemberInput {
  firstName: string;
  lastName: string;
  phone: string;
  age: number;
  relation: string;
}

export interface CreateTeamInput {
  leader: Omit<MemberInput, "relation">;
  members: MemberInput[];
}
