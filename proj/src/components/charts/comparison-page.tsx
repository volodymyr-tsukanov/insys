'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getAllDatasets } from "@/lib/data/getter";
import { Button } from "@/components/ui/button";
import loadingCat from "@/app/loading-cat.gif";

import {
  CYearRange,
  IDatasetCultureBudget,
  IDatasetRevitalization,
  IDatasetTourism,
  IDatasetEvents,
  IDatasetCultureInstitutions
} from '@/lib/consts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { json2xml, json2yaml } from "@/lib/data/convert";
import Image from "next/image";

interface DatasetOption {
  name: string;
  key: keyof Datasets;
  metrics: { label: string; key: string }[];
}

interface Datasets {
  cultureBudget: IDatasetCultureBudget;
  revitalization: IDatasetRevitalization;
  tourism: IDatasetTourism;
  events: IDatasetEvents;
  cultureInstitutions: IDatasetCultureInstitutions;
}

const datasetOptions: DatasetOption[] = [
  {
    name: 'Culture Budget',
    key: 'cultureBudget',
    metrics: [
      { label: 'Total Spending', key: 'totalSpending' },
      { label: 'Per Capita Spending', key: 'perCapitaSpending' },
      { label: 'Budget Share (%)', key: 'budgetShare' },
    ],
  },
  {
    name: 'Revitalization',
    key: 'revitalization',
    metrics: [
      { label: 'Projects Planned', key: 'projectsPlanned' },
      { label: 'Projects Completed', key: 'projectsCompleted' },
      { label: 'Renovated Flats', key: 'renovatedFlats' },
      { label: 'Renovation Cost (Mln PLN)', key: 'renovationCostMln' },
    ],
  },
  {
    name: 'Tourism',
    key: 'tourism',
    metrics: [
      { label: 'Total Visitors', key: 'totalVisitors' },
      { label: 'Tourists', key: 'tourists' },
      { label: 'Info Center Visitors', key: 'infoCenterVisitors' },
      { label: 'Foreign Tourists', key: 'foreignTourists' },
      { label: 'Tourism Budget', key: 'tourismBudget' },
    ],
  },
  {
    name: 'Events',
    key: 'events',
    metrics: [
      { label: 'Spending (Mln PLN)', key: 'spendingMln' },
      { label: 'Spending Share (%)', key: 'spendingShare' },
      { label: 'Participants Per Capita', key: 'participantsPerCapita' },
    ],
  },
  {
    name: 'Culture Institutions',
    key: 'cultureInstitutions',
    metrics: [
      { label: 'Public Libraries', key: 'publicLibraries' },
      { label: 'Culture Centers', key: 'cultureCenters' },
      { label: 'Cinemas', key: 'cinemas' },
      { label: 'Museums', key: 'museums' },
    ],
  },
];

const ComparisonPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Datasets | null>(null);
  const [selectedDataset1, setSelectedDataset1] = useState<DatasetOption | null>(null);
  const [selectedMetric1, setSelectedMetric1] = useState<string>('');
  const [selectedDataset2, setSelectedDataset2] = useState<DatasetOption | null>(null);
  const [selectedMetric2, setSelectedMetric2] = useState<string>('');
  const [chartData1, setChartData1] = useState<any[]>([]);
  const [chartData2, setChartData2] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDatasets();
        setDatasets(data);
        setSelectedDataset1(datasetOptions[0]);
        setSelectedMetric1(datasetOptions[0].metrics[0].key);
        setSelectedDataset2(datasetOptions[1]);
        setSelectedMetric2(datasetOptions[1].metrics[0].key);
      } catch (err) {
        setError('Failed to load datasets');
        console.error(err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!datasets || !selectedDataset1 || !selectedMetric1) return;
    const dataset = datasets[selectedDataset1.key] as Record<string, Record<string, number>>;
    const data = CYearRange.map(year => {
      const yearStr = year.toString();
      const value = dataset[selectedMetric1]?.[yearStr] ?? null;
      return { year: yearStr, value };
    }).filter(item => item.value != null);
    setChartData1(data);
  }, [datasets, selectedDataset1, selectedMetric1]);
  useEffect(() => {
    if (!datasets || !selectedDataset2 || !selectedMetric2) return;
    const dataset = datasets[selectedDataset2.key] as Record<string, Record<string, number>>;
    const data = CYearRange.map(year => {
      const yearStr = year.toString();
      const value = dataset[selectedMetric2]?.[yearStr] ?? null;
      return { year: yearStr, value };
    }).filter(item => item.value != null);
    setChartData2(data);
  }, [datasets, selectedDataset2, selectedMetric2]);
  useEffect(() => {
    if (!datasets || !selectedDataset1 || !selectedDataset2 || !selectedMetric1 || !selectedMetric2) return;

    const combined = CYearRange.map(year => {
      const yearStr = year.toString();
      const val1 = datasets[selectedDataset1.key]?.[selectedMetric1]?.[yearStr] ?? null;
      const val2 = datasets[selectedDataset2.key]?.[selectedMetric2]?.[yearStr] ?? null;
      return {
        year: yearStr,
        [selectedMetric1]: val1,
        [selectedMetric2]: val2,
      };
    }).filter(item => item[selectedMetric1] != null || item[selectedMetric2] != null);

    setChartData(combined);
  }, [datasets, selectedDataset1, selectedDataset2, selectedMetric1, selectedMetric2]);

  const exportData = (fileType: 'json' | 'xml' | 'yaml') => {
    if (!chartData.length) return;

    const data = {
      dataset1: {
        name: selectedDataset1?.name,
        metric: selectedDataset1?.metrics.find(m => m.key === selectedMetric1)?.label
      },
      dataset2: {
        name: selectedDataset2?.name,
        metric: selectedDataset2?.metrics.find(m => m.key === selectedMetric2)?.label
      },
      data: chartData
    };

    let blob: Blob;
    const mimeTypes = {
      json: 'application/json',
      xml: 'application/xml',
      yaml: 'application/yaml'
    };

    switch (fileType) {
      case 'json':
        blob = new Blob([JSON.stringify(data, null, 2)], { type: mimeTypes.json });
        break;
      case 'xml':
        blob = new Blob([json2xml(data)], { type: mimeTypes.xml });
        break;
      case 'yaml':
        blob = new Blob([json2yaml(data)], { type: mimeTypes.yaml });
        break;
      default:
        console.error('Unsupported file type');
        return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison-data.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  if (!datasets) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Image src={loadingCat} width={300} height={300} alt="loading cat" />
      </div>
    );
  }
  return (
    <div className="p-5 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[selectedDataset1, selectedDataset2].map((selectedDataset, idx) => {
          const setDataset = idx === 0 ? setSelectedDataset1 : setSelectedDataset2;
          const setMetric = idx === 0 ? setSelectedMetric1 : setSelectedMetric2;
          const selectedMetric = idx === 0 ? selectedMetric1 : selectedMetric2;

          return (
            <Card key={idx} className="p-4">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dataset {idx + 1}</Label>
                  <Select
                    value={selectedDataset?.key || ''}
                    onValueChange={(value) => {
                      const selected = datasetOptions.find(opt => opt.key === value);
                      if (selected) {
                        setDataset(selected);
                        setMetric(selected.metrics[0].key);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasetOptions.map(option => (
                        <SelectItem key={option.key} value={option.key}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedDataset && (
                    <div className="space-y-2">
                      <Label>Metric</Label>
                      <Select
                        value={selectedMetric}
                        onValueChange={setMetric}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedDataset.metrics.map(metric => (
                            <SelectItem key={metric.key} value={metric.key}>
                              {metric.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[chartData1, chartData2].map((data, idx) => (
          <ResponsiveContainer key={idx} width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="value"
                name={(idx === 0 ? selectedDataset1 : selectedDataset2)?.metrics.find(m => m.key === (idx === 0 ? selectedMetric1 : selectedMetric2))?.label || 'Value'}
                stroke={idx === 0 ? "#8884d8" : "#82ca9d"}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ))}
      </div>

      {selectedDataset1?.key === selectedDataset2?.key && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Combined Chart – {selectedDataset1.name}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey={selectedMetric1}
                name={selectedDataset1.metrics.find(m => m.key === selectedMetric1)?.label}
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric2}
                name={selectedDataset2.metrics.find(m => m.key === selectedMetric2)?.label}
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>


        </div>
      )}
      <div className="w-full flex justify-end gap-2 mt-4">
        <Popover>
          <PopoverTrigger>
            <Button variant="outline">Export Data</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <div
                role="button"
                onClick={() => exportData('json')}
                className={`bg-black text-white py-2 px-4 rounded cursor-pointer ${!chartData.length ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Export to JSON
              </div>
              <div
                role="button"
                onClick={() => exportData('xml')}
                className={`bg-black text-white py-2 px-4 rounded cursor-pointer ${!chartData.length ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Export to XML
              </div>
              <div
                role="button"
                onClick={() => exportData('yaml')}
                className={`bg-black text-white py-2 px-4 rounded cursor-pointer ${!chartData.length ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Export to YAML
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ComparisonPage;
