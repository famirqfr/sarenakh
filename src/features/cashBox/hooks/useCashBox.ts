import { Team } from "@/features/team/types/team.type";
import { useEffect, useState } from "react";

export function useCashBox() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/cashbox");
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setAllowed(false);
        } else {
          setTeams(data.teams);
          setAllowed(true);
        }
      } catch (err) {
        setError("خطای شبکه");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { teams, loading, error, allowed };
}
