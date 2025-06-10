import ChartProvider from "@/components/chart-provider";
import {
    Bar,
    BarChart,
    CartesianGrid, Cell,
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

export default function CostPerParticipant({metrics, events}: ChartProps) {

    const [costData, setCostData] = React.useState<any[]>([]);

    useEffect(() => {
        if(metrics && events) {
            const data = transformToChartData(
                metrics.results.costPerEventParticipant,
                'year',
                'cost'
            );
            setCostData(data);
        }

    }, [metrics, events]);


    return(
        <TabsContent value="cost-per-participant" className="mt-6">
            <ChartProvider metrics={metrics} events={events}>
                <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg mb-4">Cost per Participant</h3>
                    <p className="text-sm text-gray-600 mb-4">Assess efficiency of spending across years.</p>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={costData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [Number(value).toFixed(3), 'Institutions per 10k']} />
                            <Legend />
                            <Bar dataKey="cost" fill="#313131" maxBarSize={40}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartProvider>
        </TabsContent>
    )
}