'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import {useDataStore} from "@/app/store/useDataStore";
import Calculate from "@/components/Calculate";
import Link from "next/link";
import {ChartSpline, Home} from "lucide-react";

export function AppSidebar() {

    const {
        metrics,
        setMetrics,
        metricsLoading,
        setMetricsLoading,
        events,
        setEvents,
        eventsLoading,
        setEventsLoading,
    } = useDataStore();

    return (
        <Sidebar>
            <SidebarHeader><h1 className="text-2xl mb-4">Insys<br/> Lublin- Stolica Kultury</h1></SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="flex gap-2 items-center"><Home size={16}/><Link href="/" >Dashboard</Link></div>
                    <div className="flex gap-2 items-center"><ChartSpline size={16}/><Link href="/metrics">Metrics Visualizer</Link></div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}