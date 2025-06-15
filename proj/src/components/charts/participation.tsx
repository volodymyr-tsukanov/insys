import ChartProvider from "@/components/chart-provider";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {TabsContent} from "@/components/ui/tabs";
import React, {useEffect} from "react";
import {transformToChartData} from "@/lib/transformToCharData";

type ChartProps = {
    metrics: any | null;
    events: any | null;
};

export default function Participation({metrics, events}: ChartProps) {

    const [participationData, setParticipationData] = React.useState<any[]>([]);

    useEffect(() => {
        if(metrics && events) {
            const data = transformToChartData(
                metrics.results.eventParticipationPerCitizen,
                'year',
                'participation'
            );
            console.log(metrics.results.eventParticipationPerCitizen)
            setParticipationData(data);
        }

    }, [metrics, events]);


    return(
        <TabsContent value="participation" className="mt-6">
            <ChartProvider metrics={metrics} events={events}>
                <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg mb-4">Participation per Citizen</h3>
                    <p>Show trend of cultural engagement over time.</p>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={participationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [Number(value).toFixed(3), 'Participation']} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="participation"
                                stroke="#8884d8"
                                strokeWidth={3}
                                dot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </ChartProvider>
        </TabsContent>
    )
}