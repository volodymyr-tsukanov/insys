"use client";
import React from "react";
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
import { useDataStore } from "@/app/store/useDataStore";
import { CEventMonths } from "@/lib/consts";

const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function transformEnrichedToChartData() {
    const enriched = useDataStore.getState().metrics?.integrated;
    if (!enriched || enriched.length === 0) {
        console.error(false);
        return [];
    }

    // Use latest year for chart
    const latest = enriched[enriched.length - 3];

    const holidays = latest.holidaysByMonth;
    const weekends = latest.weekendsByMonth;

    const eventsPerMonth: Record<string, number> = {};
    Object.values(CEventMonths).forEach(month => {
        const m = String(month).padStart(2, '0');
        eventsPerMonth[m] = (eventsPerMonth[m] || 0) + 1;
    });

    return MONTH_LABELS.map((label, idx) => {
        const m = String(idx + 1).padStart(2, '0');
        return {
            month: label,
            holidays: holidays?.[m] || 0,
            weekends: weekends?.[m] || 0,
            festivals: eventsPerMonth?.[m] || 0,
        };
    });
}

export default function HolidaysWeekendsChart() {
    const chartData = transformEnrichedToChartData();

    return (
        <TabsContent value="holiday-weekend" className="mt-6">
            <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg mb-4">Monthly Holidays vs Weekends</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Comparison of official holidays, weekends, and known festivals by month (latest year available).
                </p>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="holidays" fill="#8884d8" name="Holidays" />
                        <Bar dataKey="weekends" fill="#82ca9d" name="Weekends" />
                        <Bar dataKey="festivals" fill="#ffc658" name="Festivals" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </TabsContent>
    );
}
