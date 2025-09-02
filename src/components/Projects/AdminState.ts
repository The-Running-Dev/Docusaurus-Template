import { create } from 'zustand';

interface AdminState {
  adminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  selectedProjects: string[];
  setSelectedProjects: (ids: string[]) => void;
}

export const useAdminState = create<AdminState>((set) => ({
  adminMode: false,
  setAdminMode: (mode) => set({ adminMode: mode }),
  selectedProjects: [],
  setSelectedProjects: (ids) => set({ selectedProjects: ids })
}));
