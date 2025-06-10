import ChartProvider from "@/components/chart-provider";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {TabsContent} from "@/components/ui/tabs";
import React, {useEffect} from "react";
import {transformToChartData} from "@/lib/transformToCharData";

type ChartProps = {
    metrics: any | null;
    events: any | null;
};

export default function Tourists({metrics, events}: ChartProps) {

    const [touristsData, setTouristsData] = React.useState<any[]>([]);

    useEffect(() => {
        if (metrics && events) {
            const data = transformToChartData(
                metrics.results.eventParticipationPerCitizen,
                'year',
                'tourists'
            );
            setTouristsData(data);
        }

    }, [metrics, events]);


    return (
        <TabsContent value="tourists" className="mt-6">
            <ChartProvider metrics={metrics} events={events}>
                <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg mb-4">Tourists per Resident</h3>
                    <p className="text-sm text-gray-600 mb-4">Track tourism intensity or growth potential year by year.</p>
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={touristsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [Number(value).toFixed(3), 'Tourists per Citizen']} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="tourists"
                                stroke="#ffc658"
                                fill="#ffc658"
                                fillOpacity={0.6}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </ChartProvider>
        </TabsContent>
    )
}