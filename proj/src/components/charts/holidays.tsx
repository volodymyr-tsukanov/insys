"use client";
import { FestivalMonths } from "@/lib/consts"; // adjust the import as needed
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

export function transformFestivalMonthsToChartData() {
    const monthCounts = new Array(12).fill(0);

    Object.values(FestivalMonths).forEach((month) => {
        if (month >= 1 && month <= 12) {
            monthCounts[month - 1]++;
        }
    });

    const monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return monthCounts.map((count, index) => ({
        month: monthLabels[index],
        festivals: count,
    }));
}

export default function FestivalChart() {
    const chartData = transformFestivalMonthsToChartData();

    return (
        <TabsContent value="festival-months" className="mt-6">
            <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg mb-4">Monthly Festival Count</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Number of festivals held in each month.
                </p>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="festivals" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </TabsContent>
    );
}
