'use client';
import { useState } from 'react';
import type { IDatasetProcessed } from '@/lib/data/proc';
import { IDatasetEvents } from '@/lib/consts';

interface CalculateClientProps {
    setMetrics: (metrics: IDatasetProcessed) => void;
    metricsLoading: "loading" | "error" | "success" | null;
    setMetricsLoading: (metricsLoading: "loading" | "error" | "success" | null) => void;
    setEvents: (events: IDatasetEvents) => void;
    eventsLoading: "loading" | "error" | "success" | null;
    setEventsLoading: (eventsLoading: "loading" | "error" | "success" | null) => void;
}

export default function CalculateClient({setMetrics, setMetricsLoading, setEvents, setEventsLoading, metricsLoading, eventsLoading } : CalculateClientProps) {

    const handleCaclulate = async () => {
        setMetricsLoading("loading")
        try {
            const res = await fetch('/api/calculate', { next: { revalidate: 60 } });
            if (!res.ok) throw new Error('Failed to fetch calculations');
            const json: IDatasetProcessed = await res.json();
            setMetricsLoading("success")
            setMetrics(json);
        } catch (e: any) {
            setMetricsLoading("error")
        }
    };
    const handleGetEvents = async () => {
        setEventsLoading("loading")
        try {
            const res = await fetch(
                '/api/get?type=events',
                { next: { revalidate: 60 } });
            if (!res.ok) throw new Error('Failed to fetch events');
            const json: IDatasetEvents = await res.json();
            setEventsLoading("success")
            setEvents(json)
        } catch (e: any) {
            setEventsLoading("error")
        }
    };

    return (
        <div>
            <button
                onClick={handleCaclulate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={metricsLoading === "loading"}
            >
                {metricsLoading === "loading" ? 'Calculating...' : 'Calculate Metrics'}
            </button>
            <button
                onClick={handleGetEvents}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={eventsLoading === "loading"}
            >
                {eventsLoading === "loading" ? 'Getting...' : 'Get Events Data'}
            </button>
        </div>
    );
}
