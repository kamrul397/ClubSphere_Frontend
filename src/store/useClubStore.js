// src/store/useClubStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useClubStore = create(
  persist(
    (set) => ({
      selectedClub: null,

      setSelectedClub: (club) => set({ selectedClub: club }),

      clearClub: () => set({ selectedClub: null }),
    }),
    {
      name: "club-storage",
    },
  ),
);

export default useClubStore;
