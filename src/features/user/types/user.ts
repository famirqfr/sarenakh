export type Role = "SUPERADMIN" | "ADMIN" | "MENTOR" | "CASHIER";
export type MentorType = "GOOD" | "BAD";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  mentorType: MentorType | null;
  createdAt: string;
}
