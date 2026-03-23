import { create } from 'zustand';
import type { FilterState, Body, FilterMode, MapColorMode } from '../lib/types';

interface FilterStore extends FilterState {
  setBody: (body: Body) => void;
  setMode: (mode: FilterMode) => void;
  setYear: (year: number) => void;
  setResolutionId: (id: string | null) => void;
  setTopic: (topic: string | null) => void;
  resolutionPickerOpen: boolean;
  setResolutionPickerOpen: (open: boolean) => void;
  mapColorMode: MapColorMode;
  compareCountry: string | null;
  setMapColorMode: (mode: MapColorMode) => void;
  setCompareCountry: (iso3: string | null) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  body: 'GA',
  mode: 'year',
  year: 2025,
  resolutionId: null,
  topic: null,
  resolutionPickerOpen: false,
  mapColorMode: 'default',
  compareCountry: null,
  setBody: (body) => set({ body }),
  setMode: (mode) => set({ mode }),
  setYear: (year) => set({ year }),
  setResolutionId: (resolutionId) => set({ resolutionId }),
  setTopic: (topic) => set({ topic }),
  setResolutionPickerOpen: (resolutionPickerOpen) => set({ resolutionPickerOpen }),
  setMapColorMode: (mapColorMode) => set({ mapColorMode }),
  setCompareCountry: (compareCountry) => set({ compareCountry }),
}));
