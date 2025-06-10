import ChartProvider from "@/components/chart-provider";
import {
    Bar,
    BarChart,
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

export default function Institutions({metrics, events}: ChartProps) {

    const [institutionsData, setInstitutionsData] = React.useState<any[]>([]);

    useEffect(() => {
        if(metrics && events) {
            const data = transformToChartData(
                metrics.intermediate.institutionsPer10kCitizens,
                'year',
                'institutions'
            );
            setInstitutionsData(data);
        }

    }, [metrics, events]);


    return(
        <TabsContent value="institutions" className="mt-6">
            <ChartProvider metrics={metrics} events={events}>
                <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg mb-4">Institutions per Citizen</h3>
                    <p className="text-sm text-gray-600 mb-4">Visualize availability of infrastructure as population changes.</p>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={institutionsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [Number(value).toFixed(3), 'Institutions per 10k']} />
                            <Legend />
                            <Bar dataKey="institutions" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartProvider>
        </TabsContent>
    )
}