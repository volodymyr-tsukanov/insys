"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TabsContent } from "@/components/ui/tabs";
import { useDataStore } from "@/app/store/useDataStore";
import type { IEnrichedYear } from "@/lib/consts";


export default function WeekendsChart() {
  const metrics = useDataStore(state => state.metrics);
  const [chartData, setChartData] = useState<any[]>([]);
  const [alignment, setAlignment] = useState<number>(0);

  useEffect(() => {
    const enriched: IEnrichedYear[] | undefined = metrics?.integrated;
    if (!enriched || enriched.length === 0) {
      return;
    }

    setAlignment(enriched[4]!.eventHolidayAlignment!);
    const data = enriched
      .sort((a, b) => +a.year - +b.year)
      .map((yearData) => ({
        year: yearData.year,
        participants: yearData.eventTotalParticipants || 0,
        alignment: yearData.eventHolidayAlignment ?? null,
        weekendDensity: yearData.weekendEventDensity ?? null,
      }));

    setChartData(data);
  }, [metrics]);

  return (
    <TabsContent value="brainrot" className="mt-6">
      <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg mb-4">Events & Alignment Trends (2015–2024)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Visualization of total event participants, event-holiday alignment, and weekend event density over the years.
        </p>
        <div className="text-sm text-gray-700 mt-2">
          <span className="inline-block w-4 h-1 mr-2 bg-[#ff7300]"></span>
          Event-Holiday Alignment = {alignment}
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              yAxisId="left"
              orientation="left"
              allowDecimals={false}
              label={{ value: "Participants", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 1]}
              label={{ value: "Ratio (0–1)", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="participants" fill="#8884d8" name="Total Participants" />
            <Line yAxisId="right" type="monotone" dataKey="alignment" stroke="#ff7300" name="Event-Holiday Alignment" legendType="none" />
            <Line yAxisId="right" type="monotone" dataKey="weekendDensity" stroke="#82ca9d" name="Weekend Event Density" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </TabsContent>
  );
}
