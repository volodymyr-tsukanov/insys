"use client";
import { CEventMonths } from "@/lib/consts";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";

// Example CEventMonths:
// { 'Festival A': 5, 'Festival B': 5, 'Festival C': 6, ... }

export function transformFestivalMonthsToChartData() {
    const monthData = Array.from({ length: 12 }, () => ({ festivals: 0, names: [] as string[] }));

    Object.entries(CEventMonths).forEach(([festival, month]) => {
        if (month >= 1 && month <= 12) {
            const idx = month - 1;
            monthData[idx].festivals++;
            monthData[idx].names.push(festival);
        }
    });

    const monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return monthData.map((data, index) => ({
        month: monthLabels[index],
        festivals: data.festivals,
        names: data.names,
    }));
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length > 0) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border p-2 rounded shadow-md text-sm max-w-[200px]">
                <strong>{data.month}</strong>
                <div className="mt-1">
                    <p><strong>Total:</strong> {data.festivals}</p>
                    {data.names.length > 0 ? (
                        <ul className="mt-1 list-disc ml-4 max-h-[150px] overflow-y-auto">
                            {data.names.map((name: string, idx: number) => (
                                <li key={idx}>{name}</li>
                            ))}
                        </ul>
                    ) : <p>No festivals</p>}
                </div>
            </div>
        );
    }
    return null;
};

export default function FestivalChart() {
    const chartData = transformFestivalMonthsToChartData();

    return (
        <TabsContent value="festival-months" className="mt-6">
            <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg mb-4">Monthly Festival Count</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Number and names of festivals held in each month.
                </p>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="festivals" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </TabsContent>
    );
}
