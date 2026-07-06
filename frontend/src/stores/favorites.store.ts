import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Court } from "@/types/court.type";
import { favoriteService } from "@/services/favorite.service";
import { useAuthStore } from "./auth.store";

interface FavoritesState {
  favorites: Court[];
  guestFavorites: Court[];
  isFavorite: (courtId: number) => boolean;
  toggleFavorite: (court: Court) => Promise<void>;
  removeFavorite: (courtId: number) => Promise<void>;
  clearFavorites: () => void;
  syncFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      guestFavorites: [],

      isFavorite: (courtId: number) =>
        get().favorites.some((c) => c.id === courtId),

      toggleFavorite: async (court: Court) => {
        const user = useAuthStore.getState().user;
        const exists = get().favorites.some((c) => c.id === court.id);
        
        if (exists) {
          set((state) => {
            const newFavorites = state.favorites.filter((c) => c.id !== court.id);
            return user 
              ? { favorites: newFavorites } 
              : { favorites: newFavorites, guestFavorites: newFavorites };
          });
          if (user) {
            try { await favoriteService.removeFavorite(court.id); } catch(e) {}
          }
        } else {
          set((state) => {
            const newFavorites = [...state.favorites, court];
            return user 
              ? { favorites: newFavorites } 
              : { favorites: newFavorites, guestFavorites: newFavorites };
          });
          if (user) {
            try { await favoriteService.addFavorite(court.id); } catch(e) {}
          }
        }
      },

      removeFavorite: async (courtId: number) => {
        const user = useAuthStore.getState().user;
        set((state) => {
          const newFavorites = state.favorites.filter((c) => c.id !== courtId);
          return user 
            ? { favorites: newFavorites } 
            : { favorites: newFavorites, guestFavorites: newFavorites };
        });
        if (user) {
          try { await favoriteService.removeFavorite(courtId); } catch(e) {}
        }
      },

      // Khi đăng xuất, khôi phục lại danh sách của khách vãng lai
      clearFavorites: () => set((state) => ({ favorites: state.guestFavorites || [] })),

      syncFavorites: async () => {
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const data = await favoriteService.getMyFavorites();
            if (data && Array.isArray(data)) {
               set({ favorites: data });
            }
          } catch(e) {
            console.error("Failed to sync favorites", e);
          }
        }
      }
    }),
    {
      name: "pickleball-favorites", // key trong localStorage
    }
  )
);
