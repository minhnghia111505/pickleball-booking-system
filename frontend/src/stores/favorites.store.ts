import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Court } from "@/types/court.type";

interface FavoritesState {
  favorites: Court[];
  isFavorite: (courtId: number) => boolean;
  toggleFavorite: (court: Court) => void;
  removeFavorite: (courtId: number) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      isFavorite: (courtId: number) =>
        get().favorites.some((c) => c.id === courtId),

      toggleFavorite: (court: Court) => {
        const exists = get().favorites.some((c) => c.id === court.id);
        if (exists) {
          set((state) => ({
            favorites: state.favorites.filter((c) => c.id !== court.id),
          }));
        } else {
          set((state) => ({ favorites: [...state.favorites, court] }));
        }
      },

      removeFavorite: (courtId: number) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c.id !== courtId),
        })),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "pickleball-favorites", // key trong localStorage
    }
  )
);
