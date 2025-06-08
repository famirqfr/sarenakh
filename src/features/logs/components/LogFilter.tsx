import { useState, useEffect } from "react";
import Select from "@/components/ui/forms/select"; // مسیر درست فایل Select خودت رو جایگزین کن

type Team = { id: string; name: string };
type User = { id: string; firstName: string; lastName: string };
type ActionOption = { value: string; label: string };

type LogFilterValues = {
  teamId?: string;
  userId?: string;
  action?: string;
};

type LogFilterProps = {
  onChange: (filters: LogFilterValues) => void;
  teams: Team[];
  users: User[];
  actions: ActionOption[];
};

export function LogFilter({ onChange, teams, users, actions }: LogFilterProps) {
  const [teamId, setTeamId] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    onChange({ teamId, userId, action });
  }, [teamId, userId, action]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <Select
        label="تیم"
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        options={[
          { value: "", label: "همه تیم‌ها" },
          ...teams.map((team) => ({ value: team.id, label: team.name })),
        ]}
      />

      <Select
        label="کاربر"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        options={[
          { value: "", label: "همه کاربران" },
          ...users.map((user) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName}`,
          })),
        ]}
      />

      <Select
        label="نوع اکشن"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        options={[{ value: "", label: "همه اکشن‌ها" }, ...actions]}
      />
    </div>
  );
}
