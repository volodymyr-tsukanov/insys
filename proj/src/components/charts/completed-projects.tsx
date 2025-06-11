import ChartProvider from "@/components/chart-provider";
import {
    Bar,
    BarChart,
    CartesianGrid, Cell,
    ComposedChart,
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

export default function CompletedProjects({metrics, events}: ChartProps) {

    const [projectData, setProjectData] = React.useState<any[]>([]);

    useEffect(() => {
        if(metrics && events) {
            const data = transformToChartData(
                metrics.results.revitalizationCompletionRate,
                'year',
                'completion'
            );
            setProjectData(data);
        }

    }, [metrics, events]);


    return(
        <TabsContent value="completed-projects" className="mt-6">
            <ChartProvider metrics={metrics} events={events}>
                <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg mb-4">Completed Projects Ratio</h3>
                    <p className="text-sm text-gray-600 mb-4">Track success of revitalization implementation over time.</p>
                    <ResponsiveContainer width="100%" height="80%">
                        <ComposedChart data={projectData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Completion Rate']} />
                            <Legend />
                            <Bar dataKey="completion" fill="#8884d8" />
                            <Line
                                type="monotone"
                                dataKey="completion"
                                stroke="#ff7300"
                                strokeWidth={2}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </ChartProvider>
        </TabsContent>
    )
}