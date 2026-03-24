import { create } from 'zustand';
import type { FilterState, Body, FilterMode, MapColorMode, ResolutionMeta } from '../lib/types';

interface FilterStore extends FilterState {
  setBody: (body: Body) => void;
  setMode: (mode: FilterMode) => void;
  setYear: (year: number) => void;
  setResolutionId: (id: string | null) => void;
  setResolutionMeta: (meta: ResolutionMeta | null) => void;
  resolutionMeta: ResolutionMeta | null;
  setTopic: (topic: string | null) => void;
  resolutionPickerOpen: boolean;
  setResolutionPickerOpen: (open: boolean) => void;
  topicPickerOpen: boolean;
  setTopicPickerOpen: (open: boolean) => void;
  topicResIds: string[] | null;
  setTopicResIds: (ids: string[] | null) => void;
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
  resolutionMeta: null,
  topic: null,
  resolutionPickerOpen: false,
  topicPickerOpen: false,
  topicResIds: null,
  mapColorMode: 'default',
  compareCountry: null,
  setBody: (body) => set({ body }),
  setMode: (mode) => set({ mode }),
  setYear: (year) => set({ year }),
  setResolutionId: (resolutionId) => set({ resolutionId }),
  setResolutionMeta: (resolutionMeta) => set({ resolutionMeta }),
  setTopic: (topic) => set({ topic }),
  setResolutionPickerOpen: (resolutionPickerOpen) => set({ resolutionPickerOpen }),
  setTopicPickerOpen: (topicPickerOpen) => set({ topicPickerOpen }),
  setTopicResIds: (topicResIds) => set({ topicResIds }),
  setMapColorMode: (mapColorMode) => set({ mapColorMode }),
  setCompareCountry: (compareCountry) => set({ compareCountry }),
}));
