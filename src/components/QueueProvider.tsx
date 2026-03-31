"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { QueueItem } from "@/src/types/post";

interface QueueState {
  items: QueueItem[];
  currentIndex: number;
  isPlaying: boolean;
  progress: number; // 0-100
}

interface QueueContextValue extends QueueState {
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  reorder: (from: number, to: number) => void;
  play: (index?: number) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (pct: number) => void;
  currentTrack: QueueItem | null;
}

const QueueContext = createContext<QueueContextValue | null>(null);

const STORAGE_KEY = "kanabi-queue";

function loadFromStorage(): QueueState {
  if (typeof window === "undefined")
    return { items: [], currentIndex: -1, isPlaying: false, progress: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...parsed, isPlaying: false, progress: 0 };
    }
  } catch {}
  return { items: [], currentIndex: -1, isPlaying: false, progress: 0 };
}

export function QueueProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QueueState>({
    items: [],
    currentIndex: -1,
    isPlaying: false,
    progress: 0,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mounted = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    setState(loadFromStorage());
    mounted.current = true;
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted.current) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: state.items,
        currentIndex: state.currentIndex,
      })
    );
  }, [state.items, state.currentIndex]);

  // Audio element management
  useEffect(() => {
    const track =
      state.currentIndex >= 0 ? state.items[state.currentIndex] : null;
    if (!track?.audio_url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    if (!audioRef.current || audioRef.current.src !== track.audio_url) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(track.audio_url);
      audioRef.current.addEventListener("timeupdate", () => {
        if (!audioRef.current) return;
        const pct =
          audioRef.current.duration > 0
            ? (audioRef.current.currentTime / audioRef.current.duration) * 100
            : 0;
        setState((s) => ({ ...s, progress: pct }));
      });
      audioRef.current.addEventListener("ended", () => {
        // Auto-play next
        setState((s) => {
          if (s.currentIndex < s.items.length - 1) {
            return { ...s, currentIndex: s.currentIndex + 1 };
          }
          return { ...s, isPlaying: false, progress: 0 };
        });
      });
    }

    if (state.isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [state.currentIndex, state.isPlaying, state.items]);

  const addToQueue = useCallback((item: QueueItem) => {
    setState((s) => {
      if (s.items.some((i) => i.id === item.id)) return s;
      const newItems = [...s.items, item];
      const newIndex = s.currentIndex < 0 ? 0 : s.currentIndex;
      return { ...s, items: newItems, currentIndex: newIndex };
    });
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setState((s) => {
      const idx = s.items.findIndex((i) => i.id === id);
      if (idx === -1) return s;
      const newItems = s.items.filter((i) => i.id !== id);
      let newIndex = s.currentIndex;
      if (idx < s.currentIndex) newIndex--;
      else if (idx === s.currentIndex) {
        newIndex = Math.min(newIndex, newItems.length - 1);
      }
      return {
        ...s,
        items: newItems,
        currentIndex: newItems.length === 0 ? -1 : newIndex,
        isPlaying: idx === s.currentIndex ? false : s.isPlaying,
      };
    });
  }, []);

  const clearQueue = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setState({ items: [], currentIndex: -1, isPlaying: false, progress: 0 });
  }, []);

  const reorder = useCallback((from: number, to: number) => {
    setState((s) => {
      const newItems = [...s.items];
      const [moved] = newItems.splice(from, 1);
      newItems.splice(to, 0, moved);
      let newIndex = s.currentIndex;
      if (s.currentIndex === from) newIndex = to;
      else if (from < s.currentIndex && to >= s.currentIndex) newIndex--;
      else if (from > s.currentIndex && to <= s.currentIndex) newIndex++;
      return { ...s, items: newItems, currentIndex: newIndex };
    });
  }, []);

  const play = useCallback((index?: number) => {
    setState((s) => ({
      ...s,
      currentIndex: index !== undefined ? index : s.currentIndex,
      isPlaying: true,
      progress: index !== undefined ? 0 : s.progress,
    }));
  }, []);

  const pause = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      if (s.currentIndex < s.items.length - 1)
        return { ...s, currentIndex: s.currentIndex + 1, progress: 0 };
      return s;
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      if (s.currentIndex > 0)
        return { ...s, currentIndex: s.currentIndex - 1, progress: 0 };
      return s;
    });
  }, []);

  const seekTo = useCallback((pct: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
    }
    setState((s) => ({ ...s, progress: pct }));
  }, []);

  const currentTrack =
    state.currentIndex >= 0 && state.currentIndex < state.items.length
      ? state.items[state.currentIndex]
      : null;

  return (
    <QueueContext.Provider
      value={{
        ...state,
        addToQueue,
        removeFromQueue,
        clearQueue,
        reorder,
        play,
        pause,
        toggle,
        next,
        prev,
        seekTo,
        currentTrack,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error("useQueue must be used within QueueProvider");
  return ctx;
}
