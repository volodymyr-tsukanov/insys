'use client'

import Calculate from "@/components/Calculate";
import {useEffect, useState} from "react";
import type {IDatasetProcessed} from "@/lib/data/proc";
import {IDatasetEvents} from "@/lib/consts";



export default function Home() {

    const [metricsLoading, setMetricsLoading] = useState<"loading" | "error" | "success" | null>(null);
    const [metrics, setMetrics] = useState<IDatasetProcessed | null>(null);

    const [eventsLoading, setEventsLoading] = useState<"loading" | "error" | "success" | null>(null);
    const [events, setEvents] = useState<IDatasetEvents | null>(null);

    useEffect(() => {
        console.log(metrics)
        console.log(events)
    }, [metrics, events]);


    return (
        <main className="p-6">
            <h1 className="text-2xl mb-4">📊 Insys: <b>Lublin</b> - Stolica Kultury</h1>
            {metrics ? metrics.intermediate.estimatedCitizens["2023"] : null}
            <Calculate
                setMetrics={setMetrics}
                metricsLoading={metricsLoading}
                setMetricsLoading={setMetricsLoading}
                setEvents={setEvents}
                eventsLoading={eventsLoading}
                setEventsLoading={setEventsLoading}

            />
        </main>
    );
}
