"use client";

import GamePhasesPage from "@/features/gamePhase/GamePhasesPage";

export default function MentoringManagementPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">💡 مراحل بازی</h1>
      <GamePhasesPage />
    </div>
  );
}
