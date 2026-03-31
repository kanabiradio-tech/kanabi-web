"use client";

import { useQueue } from "./QueueProvider";
import type { QueueItem } from "@/src/types/post";

interface Props {
  item: QueueItem;
  className?: string;
  variant?: "icon" | "full";
}

export default function AddToQueueButton({
  item,
  className = "",
  variant = "full",
}: Props) {
  const { addToQueue, removeFromQueue, items } = useQueue();
  const inQueue = items.some((i) => i.id === item.id);

  const handleClick = () => {
    if (inQueue) removeFromQueue(item.id);
    else addToQueue(item);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-full transition-all ${
          inQueue
            ? "bg-primary-container text-on-primary"
            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
        } ${className}`}
        title={inQueue ? "從清單移除" : "加入播放清單"}
      >
        <span className="material-symbols-outlined text-lg">
          {inQueue ? "playlist_add_check" : "playlist_add"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-label text-sm font-semibold transition-all ${
        inQueue
          ? "bg-primary-container text-on-primary"
          : "bg-surface-container-high text-primary hover:bg-surface-container-highest"
      } ${className}`}
    >
      <span className="material-symbols-outlined text-lg">
        {inQueue ? "playlist_add_check" : "playlist_add"}
      </span>
      {inQueue ? "已加入清單" : "加入播放清單"}
    </button>
  );
}
