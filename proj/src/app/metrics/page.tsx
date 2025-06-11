'use client'

import {useEffect, useState} from "react";
import {useDataStore} from "@/app/store/useDataStore";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChartProvider from "@/components/chart-provider";
import Participation from "@/components/charts/participation";
import Institutions from "@/components/charts/institutions";
import Tourists from "@/components/charts/tourists";
import ChangeInCulturalBudget from "@/components/charts/change-in-cultural-budget";
import CostPerParticipant from "@/components/charts/cost-per-participant";
import CompletedProjects from "@/components/charts/completed-projects";
import CulturalEventBudget from "@/components/charts/cultural-event-budget";
import {IEnrichedYear} from "@/lib/consts";
import {fetchMainDataset, fetchOddDataset} from "@/lib/fetcher";
import ComparisonPage from "@/components/charts/comparison-page";
import Calculate from "@/components/Calculate";
import FestivalChart from "@/components/charts/holidays";


export default function Home() {

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
    const [latestYear, setLatestYear] = useState<number | null>(null);
    const [latestData, setLatestData] = useState<IEnrichedYear | null | undefined>(null);



    return (
        <>
            <section className="w-full flex justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger/>
                    <h2 className="text-xl">Lublin Cultural Metrics Panel</h2>
                </div>
            </section>

            <section className="grid grid-cols-7 border-2 mt-5 gap-5">
                <Calculate
                    setMetrics={setMetrics}
                    metricsLoading={metricsLoading}
                    setMetricsLoading={setMetricsLoading}
                    setEvents={setEvents}
                    eventsLoading={eventsLoading}
                    setEventsLoading={setEventsLoading}
                />
                <Tabs defaultValue="participation" className="w-full mt-6 col-span-5">
                    <TabsList  className="bg-transparent flex flex-col items-start gap-2">
                        <div className="flex flex-row gap-4 bg-gray-200 p-[2px] rounded-lg">
                            <TabsTrigger value="participation">Participation per Citizen</TabsTrigger>
                            <TabsTrigger value="institutions">Institutions per Citizen</TabsTrigger>
                            <TabsTrigger value="tourists">Tourists per Resident</TabsTrigger>
                            <TabsTrigger value="change-in-cultural-budget">Change in Cultural Budget Share</TabsTrigger>
                        </div>
                        <div className="flex flex-row gap-4 bg-gray-200 p-[2px] rounded-lg">
                            <TabsTrigger value="cost-per-participant">Cost per Participant</TabsTrigger>
                            <TabsTrigger value="completed-projects">Completed Projects Ratio</TabsTrigger>
                            <TabsTrigger value="cultural-event-budget">Cultural Event Budget Share</TabsTrigger>
                            <TabsTrigger value="festival-months">Holidays</TabsTrigger>
                            <TabsTrigger value="weekends">Weekends</TabsTrigger>
                        </div>
                    </TabsList>
                    <Participation metrics={metrics} events={events}/>
                    <Institutions metrics={metrics} events={events}/>
                    <Tourists metrics={metrics} events={events}/>
                    <ChangeInCulturalBudget metrics={metrics} events={events}/>
                    <CostPerParticipant metrics={metrics} events={events}/>
                    <CompletedProjects metrics={metrics} events={events}/>
                    <CulturalEventBudget metrics={metrics} events={events}/>
                    <FestivalChart/>

                </Tabs>
                <ChartProvider metrics={metrics} events={events}>
                    <div className="col-span-1 p-4 bg-white rounded-lg shadow-md h-[500px] overflow-y-auto">
                        <h4 className="text-lg underline mb-5">Single Values Display</h4>

                        <div className="flex flex-col gap-2 mb-5">
                            <div className="flex flex-col flex-wrap">
                                <div className="font-medium">Events per Holiday</div>
                                <div className="font-light">
                                    {latestData?.eventPerWeekend?.toFixed(0) || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-5">
                            <div className="flex flex-col flex-wrap">
                                <div className="font-medium">Tourists per Holiday</div>
                                <div className="font-light">
                                    {latestData?.touristsPerWeekend?.toFixed(0) || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-5">
                            <div className="flex flex-col flex-wrap">
                                <div className="font-medium">Holiday Clustering Index</div>
                                <div className="font-light">
                                    {latestData?.holidayClusteringIndex?.toFixed(1) || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-5">
                            <div className="flex flex-col flex-wrap">
                                <div className="font-medium">Institution-to-Holiday Ratio</div>
                                <div className="font-light">
                                    {latestData?.institutionToWeekendRatio?.toFixed(3) || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-5">
                            <div className="flex flex-col flex-wrap">
                                <div className="font-medium">Latest Participation</div>
                                <div className="font-light">
                                    {metrics?.results.eventParticipationPerCitizen['2023']?.toFixed(2) || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-5">
                            <div className="flex flex-col flex-wrap">
                                <div className="font-medium">Budget Change 2023</div>
                                <div className="font-light text-green-600">
                                    +{((metrics?.results.cultureSpendingShareChange['2023'] || 0) * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </ChartProvider>
            </section>
        </>

    );
}
