import axiosInstance from "@/lib/axiosInstance";
import { GamePhase } from "../types/gamePhase.types";

export const getGamePhases = async () => {
  const res = await axiosInstance.get<GamePhase[]>("/api/game-phases");
  return res.data;
};

export const createGamePhase = async (phase: GamePhase) => {
  const res = await axiosInstance.post("/api/game-phases", phase);
  return res.data;
};

export const updateGamePhase = async (phase: GamePhase) => {
  const res = await axiosInstance.put(`/api/game-phases/${phase.id}`, phase);
  return res.data;
};

export const deleteGamePhase = async (id: string) => {
  const res = await axiosInstance.delete(`/api/game-phases/${id}`);
  return res.data;
};

export const activateGamePhase = async (id: string) => {
  const res = await axiosInstance.post(`/api/game-phases/${id}/activate`);
  return res.data;
};

export const deactivateGamePhase = async (id: string) => {
  const res = await axiosInstance.post(`/api/game-phases/${id}/deactivate`);
  return res.data;
};
