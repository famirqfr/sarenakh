import axiosInstance from "@/lib/axiosInstance";
import { CreateTeamInput, Team } from "../types/team.type";
import axios from "axios";
import { FormData } from "../schemas/team.schema";

export async function getTeams(): Promise<Team[]> {
  const response = await axiosInstance.get("/api/teams");
  return response.data.teams;
}

export async function createTeam(data: CreateTeamInput): Promise<Team> {
  try {
    const response = await axiosInstance.post("/api/teams", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "خطا در ساخت تیم");
    }
    throw new Error("خطای ناشناخته در ساخت تیم");
  }
}

export async function deleteTeam(teamId: string): Promise<void> {
  await axiosInstance.delete(`/api/teams/${teamId}`);
}

export async function updateTeam(teamId: string, data: FormData) {
  const res = await fetch(`/api/teams/${teamId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
