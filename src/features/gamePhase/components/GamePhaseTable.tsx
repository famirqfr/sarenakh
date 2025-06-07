import React from "react";
import { GamePhase } from "../types/gamePhase.types";
import { Pencil, Trash2, Play, Pause } from "lucide-react";
import Button from "@/components/ui/forms/button";

type Props = {
  phases: GamePhase[];
  onEdit: (phase: GamePhase) => void;
  onDelete: (id: string) => void;
  onActivate: (phase: GamePhase) => void;
  onPause: (phase: GamePhase) => void;
};

const GamePhaseTable: React.FC<Props> = ({
  phases,
  onEdit,
  onDelete,
  onActivate,
  onPause,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm text-right rtl whitespace-nowrap">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase tracking-wide">
          <tr>
            <th className="p-4">عنوان</th>
            <th className="p-4">امتیاز</th>
            <th className="p-4">مدت زمان</th>
            <th className="p-4">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {phases.map((phase) => (
            <tr
              key={phase.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                {phase.title}
              </td>
              <td className="p-4">{phase.rewardPoints}</td>
              <td className="p-4">{phase.duration} دقیقه</td>
              <td className="p-4">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    phase.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                      : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                  }`}
                >
                  {phase.isActive ? "فعال" : "غیرفعال"}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <Button
                  onClick={() => onEdit(phase)}
                  className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 p-2 rounded-md"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDelete(phase.id!)}
                  className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 p-2 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {!phase.isActive && (
                  <Button
                    onClick={() => onActivate(phase)}
                    className="bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 p-2 rounded-md"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                {phase.isActive && (
                  <Button
                    onClick={() => onPause(phase)}
                    className="bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 text-orange-600 p-2 rounded-md"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GamePhaseTable;
