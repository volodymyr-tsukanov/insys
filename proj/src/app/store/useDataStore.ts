import {create} from "zustand/react";
import {IDatasetProcessed} from "@/lib/data/proc";
import {IDatasetEvents} from "@/lib/consts";


type LoadingStatus = 'loading' | 'error' | 'success' | null;

interface IDataStore {
    metrics: IDatasetProcessed | null;
    setMetrics: (data: IDatasetProcessed | null) => void;
    metricsLoading: LoadingStatus;
    setMetricsLoading: (status: LoadingStatus) => void;

    events: IDatasetEvents | null;
    setEvents: (data: IDatasetEvents | null) => void;
    eventsLoading: LoadingStatus;
    setEventsLoading: (status: LoadingStatus) => void;
}

export const useDataStore = create<IDataStore>((set) => ({
    metrics: null,
    setMetrics: (data) => set({ metrics: data }),
    metricsLoading: null,
    setMetricsLoading: (status) => set({ metricsLoading: status }),

    events: null,
    setEvents: (data) => set({ events: data }),
    eventsLoading: null,
    setEventsLoading: (status) => set({ eventsLoading: status }),
}));