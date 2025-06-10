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

export default function ChangeInCulturalBudget({metrics, events}: ChartProps) {

    const [budgetChangeData, setBudgetChangeData] = React.useState<any[]>([]);

    useEffect(() => {
        if(metrics && events) {
            const data = transformToChartData(
                metrics.results.cultureSpendingShareChange,
                'year',
                'change'
            );
            setBudgetChangeData(data);
        }

    }, [metrics, events]);


    return(
        <TabsContent value="change-in-cultural-budget" className="mt-6">
            <ChartProvider metrics={metrics} events={events}>
                <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg mb-4">Change in Cultural Budget Share</h3>
                    <p className="text-sm text-gray-600 mb-4">Reveal policy or funding shifts over time.</p>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={budgetChangeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Budget Change']} />
                            <Legend />
                            <Bar dataKey="change">
                                {budgetChangeData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.change > 0 ? "#82ca9d" : "#ff7300"}
                                    />
                                ))}
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartProvider>
        </TabsContent>
    )
}