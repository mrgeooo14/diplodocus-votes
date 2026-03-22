import { create } from 'zustand';
import type { FilterState, Body, FilterMode } from '../lib/types';

interface FilterStore extends FilterState {
  setBody: (body: Body) => void;
  setMode: (mode: FilterMode) => void;
  setYear: (year: number) => void;
  setResolutionId: (id: string | null) => void;
  setTopic: (topic: string | null) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  body: 'GA',
  mode: 'year',
  year: 2023,
  resolutionId: null,
  topic: null,
  setBody: (body) => set({ body }),
  setMode: (mode) => set({ mode }),
  setYear: (year) => set({ year }),
  setResolutionId: (resolutionId) => set({ resolutionId }),
  setTopic: (topic) => set({ topic }),
}));
