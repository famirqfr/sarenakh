import axiosInstance from "@/lib/axiosInstance";

export const fetchHelpCosts = async () => {
  const { data } = await axiosInstance.get("/api/settings/help-costs");
  return {
    simple: Number(data.simple),
    professional: Number(data.professional),
    special: Number(data.special),
  };
};

export const action = async (
  teamId: string,
  delta: number,
  type: "custom-add" | "custom-deduct" | "simple" | "professional" | "special"
) => {
  const action = `mentor-help-${type}`;

  const { data } = await axiosInstance.post("/api/mentoring", {
    teamId,
    action,
    delta: -Math.abs(delta),
  });

  return data;
};

export const customAddPoints = async (teamId: string, delta: number) => {
  const { data } = await axiosInstance.post("/api/mentoring", {
    teamId,
    action: "manual-add",
    delta: Math.abs(delta),
  });

  return data;
};

export const customDeductPoints = async (teamId: string, delta: number) => {
  const { data } = await axiosInstance.post("/api/mentoring", {
    teamId,
    action: "manual-deduct",
    delta: -Math.abs(delta),
  });

  return data;
};
