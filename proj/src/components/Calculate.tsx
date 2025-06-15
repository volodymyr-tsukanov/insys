'use client';
import { useState } from 'react';
import type { IDatasetProcessed } from '@/lib/data/proc';
import { IDatasetEvents } from '@/lib/consts';
import {Check} from 'lucide-react';
import { Button } from './ui/button';

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
            console.log(json);
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
            <div className="flex items-center gap-4 mb-4">
                <Button
                    onClick={handleCaclulate}
                    className="cursor-pointer"
                    disabled={metricsLoading === "loading"}
                >
                    {metricsLoading === "loading" ? 'Calculating...' : 'Calculate Metrics'}
                </Button>
                {metricsLoading === "success" ?  <Check className="text-green-500"/> : null}

            </div>
            <div className="flex items-center gap-4 mb-4">
                <Button
                    onClick={handleGetEvents}
                    className="cursor-pointer"
                    disabled={eventsLoading === "loading"}
                >
                    {eventsLoading === "loading" ? 'Getting...' : 'Get Events Data'}
                </Button>
                {eventsLoading === "success" ?  <Check className="text-green-500"/> : null}
            </div>
        </div>
    );
}
