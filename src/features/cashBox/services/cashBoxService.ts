export const fetchTeams = async () => {
  const res = await fetch("/api/cashbox");
  return await res.json();
};

export const markAction = async (
  teamId: string,
  action: "solved" | "not-solved"
) => {
  const res = await fetch("/api/cashbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamId, action }),
  });
  return await res.json();
};
