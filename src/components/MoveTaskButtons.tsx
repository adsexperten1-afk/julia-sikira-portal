"use client";

import { useTransition } from "react";
import { moveTask } from "@/app/actions/tasks";

export default function MoveTaskButtons({
  id,
  isFirst,
  isLast,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col">
      <button
        type="button"
        disabled={isFirst || pending}
        onClick={() => startTransition(() => moveTask(id, "up"))}
        aria-label="Station nach oben"
        className="px-1 text-muted transition hover:text-foreground disabled:opacity-25"
      >
        ▲
      </button>
      <button
        type="button"
        disabled={isLast || pending}
        onClick={() => startTransition(() => moveTask(id, "down"))}
        aria-label="Station nach unten"
        className="px-1 text-muted transition hover:text-foreground disabled:opacity-25"
      >
        ▼
      </button>
    </div>
  );
}
