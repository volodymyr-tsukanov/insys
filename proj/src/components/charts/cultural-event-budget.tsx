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

export default function CulturalEventBudget({metrics, events}: ChartProps) {

    const [eventBudgetData , setEventBudgetData ] = React.useState<any[]>([]);

    useEffect(() => {
        if(metrics && events) {
            const data =  transformToChartData(
                events.spendingMln,
                'year',
                'spending'
            );
            setEventBudgetData(data);
        }

    }, [metrics, events]);


    return(
        <TabsContent value="cultural-event-budget" className="mt-6">
            <ChartProvider metrics={metrics} events={events}>
                <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg mb-4">Cultural Event Budget Share</h3>
                    <p className="text-sm text-gray-600 mb-4">Monitor how much of the total cultural budget is spent on events.</p>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={eventBudgetData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} mln PLN`, 'Spending']} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="spending"
                                stroke="#82ca9d"
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