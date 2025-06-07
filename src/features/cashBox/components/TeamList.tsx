import { useState } from "react";
import { TeamActions } from "./TeamActions";
import { Team } from "@/features/team/types/team.type";

export function TeamList({ teams }: { teams: Team[] }) {
  const [query, setQuery] = useState("");

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="جستجو تیم"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      {filtered.map((team) => (
        <div
          key={team.id}
          className="border p-2 mb-2 rounded flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold">{team.name}</h3>
            <p>امتیاز: {team.points}</p>
            {team.leader && (
              <p>
                سرگروه: {team.leader.firstName} {team.leader.lastName}
              </p>
            )}
          </div>
          <TeamActions teamId={team.id} />
        </div>
      ))}
    </div>
  );
}
