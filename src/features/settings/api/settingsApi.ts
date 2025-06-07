import axiosInstance from "@/lib/axiosInstance";

export const getInitialTeamPoints = async (): Promise<string> => {
  const { data } = await axiosInstance.get("/api/settings/initial-points");
  return data.value;
};

export const updateInitialTeamPoints = async (
  value: string
): Promise<string> => {
  const { data } = await axiosInstance.post("/api/settings/initial-points", {
    value,
  });
  return data.value;
};

export const getHelpCosts = async () => {
  const { data } = await axiosInstance.get("/api/settings/help-costs");
  return {
    simple: data.simple,
    professional: data.professional,
    special: data.special,
    box: data.box,
  };
};

export const updateHelpCosts = async ({
  simple,
  professional,
  special,
  box,
}: {
  simple: string;
  professional: string;
  special: string;
  box: string;
}) => {
  const { data } = await axiosInstance.post("/api/settings/help-costs", {
    simple,
    professional,
    special,
    box,
  });
  return data;
};
