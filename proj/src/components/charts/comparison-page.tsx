/*
 Copyright (C) 2025  volodymyr-tsukanov  insys
 for the full copyright notice see the LICENSE file in the root of repository
*/
import React, {useState, useEffect} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {getAllDatasets} from "@/lib/data/getter";
import { Button } from "@/components/ui/button";
import loadingCat from "@/app/loading-cat.gif"

 // Adjust path as needed
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
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {json2xml, json2yaml, exportChart} from "@/lib/data/convert";
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
            {label: 'Total Spending', key: 'totalSpending'},
            {label: 'Per Capita Spending', key: 'perCapitaSpending'},
            {label: 'Budget Share (%)', key: 'budgetShare'},
        ],
    },
    {
        name: 'Revitalization',
        key: 'revitalization',
        metrics: [
            {label: 'Projects Planned', key: 'projectsPlanned'},
            {label: 'Projects Completed', key: 'projectsCompleted'},
            {label: 'Renovated Flats', key: 'renovatedFlats'},
            {label: 'Renovation Cost (Mln PLN)', key: 'renovationCostMln'},
        ],
    },
    {
        name: 'Tourism',
        key: 'tourism',
        metrics: [
            {label: 'Total Visitors', key: 'totalVisitors'},
            {label: 'Tourists', key: 'tourists'},
            {label: 'Info Center Visitors', key: 'infoCenterVisitors'},
            {label: 'Foreign Tourists', key: 'foreignTourists'},
            {label: 'Tourism Budget', key: 'tourismBudget'},
        ],
    },
    {
        name: 'Events',
        key: 'events',
        metrics: [
            {label: 'Spending (Mln PLN)', key: 'spendingMln'},
            {label: 'Spending Share (%)', key: 'spendingShare'},
            {label: 'Participants Per Capita', key: 'participantsPerCapita'},
            // Note: participationByFestival is excluded as it requires festival selection
        ],
    },
    {
        name: 'Culture Institutions',
        key: 'cultureInstitutions',
        metrics: [
            {label: 'Public Libraries', key: 'publicLibraries'},
            {label: 'Culture Centers', key: 'cultureCenters'},
            {label: 'Cinemas', key: 'cinemas'},
            {label: 'Museums', key: 'museums'},
        ],
    },
];

const ComparisonPage: React.FC = () => {
    const [datasets, setDatasets] = useState<Datasets | null>(null);
    const [selectedDataset1, setSelectedDataset1] = useState<DatasetOption | null>(null);
    const [selectedMetric1, setSelectedMetric1] = useState<string>('');
    const [selectedDataset2, setSelectedDataset2] = useState<DatasetOption | null>(null);
    const [selectedMetric2, setSelectedMetric2] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    // Fetch datasets on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllDatasets();
                setDatasets(data);
                // Set default selections
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

    // Update chart data when selections change
    useEffect(() => {
        if (!datasets || !selectedDataset1 || !selectedMetric1 || !selectedDataset2 || !selectedMetric2) return;

        const data = CYearRange.map((year) => {
            const yearStr = year.toString();
            const value1 = datasets[selectedDataset1.key][selectedMetric1 as keyof typeof datasets[typeof selectedDataset1.key]]?.[yearStr] ?? null;
            const value2 = datasets[selectedDataset2.key][selectedMetric2 as keyof typeof datasets[typeof selectedDataset2.key]]?.[yearStr] ?? null;
            return {
                year: yearStr,
                [selectedDataset1.name]: value1,
                [selectedDataset2.name]: value2,
            };
        }).filter(item => item[selectedDataset1.name] != null || item[selectedDataset2.name] != null);

        setChartData(data);
    }, [datasets, selectedDataset1, selectedMetric1, selectedDataset2, selectedMetric2]);

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!datasets) {
        return <div className="w-full h-screen flex justify-center items-center"><Image src={loadingCat}  width={300} height={300} alt="loading cat"/></div>;
    }

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

    const saveData = ()=>{
        if(false){} //TODO
    };

    return (
        <div className="p-5 w-full">
            <div className="grid grid-cols-6 w-full">
            <div className="flex items-start justify-start gap-5 mb-5">
                {/* Dataset 1 Selection */}
                <Card className="p-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Dataset 1</Label>
                            <Select
                                value={selectedDataset1?.key || ''}
                                onValueChange={(value) => {
                                    const selected = datasetOptions.find(opt => opt.key === value);
                                    if (selected) {
                                        setSelectedDataset1(selected);
                                        setSelectedMetric1(selected.metrics[0].key);
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

                            {selectedDataset1 && (
                                <div className="space-y-2">
                                    <Label>Metric</Label>
                                    <Select
                                        value={selectedMetric1}
                                        onValueChange={setSelectedMetric1}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select metric" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedDataset1.metrics.map(metric => (
                                                <SelectItem key={metric.key} value={metric.key}>
                                                    {metric.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Dataset 2</Label>
                            <Select
                                value={selectedDataset2?.key || ''}
                                onValueChange={(value) => {
                                    const selected = datasetOptions.find(opt => opt.key === value);
                                    if (selected) {
                                        setSelectedDataset2(selected);
                                        setSelectedMetric2(selected.metrics[0].key);
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

                            {selectedDataset2 && (
                                <div className="space-y-2">
                                    <Label>Metric</Label>
                                    <Select
                                        value={selectedMetric2}
                                        onValueChange={setSelectedMetric2}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select metric" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedDataset2.metrics.map(metric => (
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
            </div>
            {/* Chart */}
            {chartData.length > 0 && (
                <div className="col-span-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div id="chart1">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc"/>
                                    <XAxis
                                        dataKey="year"
                                        label={{value: 'Year', position: 'bottom', offset: 0}}
                                    />
                                    <YAxis
                                        label={{value: 'Value', angle: -90, position: 'insideLeft'}}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => [value, name]}
                                        labelFormatter={(label) => `Year: ${label}`}
                                    />
                                    <Legend verticalAlign="top" height={36}/>
                                    {selectedDataset1 && (
                                        <Line
                                            type="monotone"
                                            dataKey={selectedDataset1.name}
                                            name={`${selectedDataset1.name} (${selectedDataset1.metrics.find(m => m.key === selectedMetric1)?.label})`}
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            dot={{r: 4}}
                                        />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div id="chart2" className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc"/>
                                    <XAxis
                                        dataKey="year"
                                        label={{value: 'Year', position: 'bottom', offset: 0}}
                                    />
                                    <YAxis
                                        label={{value: 'Value', angle: -90, position: 'insideLeft'}}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => [value, name]}
                                        labelFormatter={(label) => `Year: ${label}`}
                                    />
                                    <Legend verticalAlign="top" height={36}/>
                                    {selectedDataset2 && (
                                        <Line
                                            type="monotone"
                                            dataKey={selectedDataset2.name}
                                            name={`${selectedDataset2.name} (${selectedDataset2.metrics.find(m => m.key === selectedMetric2)?.label})`}
                                            stroke="#82ca9d"
                                            strokeWidth={2}
                                            dot={{r: 4}}
                                        />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="h-[450px]" id="chart3">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc"/>
                                <XAxis
                                    dataKey="year"
                                    label={{value: 'Year', position: 'bottom', offset: 0}}
                                />
                                <YAxis
                                    label={{value: 'Value', angle: -90, position: 'insideLeft'}}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string) => [value, name]}
                                    labelFormatter={(label) => `Year: ${label}`}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                {selectedDataset1 && (
                                    <Line
                                        type="monotone"
                                        dataKey={selectedDataset1.name}
                                        name={`${selectedDataset1.name} (${selectedDataset1.metrics.find(m => m.key === selectedMetric1)?.label})`}
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={{r: 4}}
                                    />
                                )}
                                {selectedDataset2 && (
                                    <Line
                                        type="monotone"
                                        dataKey={selectedDataset2.name}
                                        name={`${selectedDataset2.name} (${selectedDataset2.metrics.find(m => m.key === selectedMetric2)?.label})`}
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        dot={{r: 4}}
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            </div>
            <div className="w-full flex justify-end gap-2">
                <Button variant="outline" onClick={() => saveData()}>Save Data</Button>
                <Popover >
                    <PopoverTrigger><Button variant="outline">Export Chart</Button></PopoverTrigger>
                    <PopoverContent >
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => exportChart('chart1', 'chart1-export')}
                                disabled={!chartData.length}
                            >
                                Export Chart 1 as PNG
                            </Button>
                            <Button
                                onClick={() => exportChart('chart2', 'chart2-export')}
                                disabled={!chartData.length}
                            >
                                Export Chart 2 as PNG
                            </Button>
                            <Button
                                onClick={() => exportChart('chart3', 'chart3-export')}
                                disabled={!chartData.length}
                            >
                                Export Combined Chart as PNG
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover >
                    <PopoverTrigger><Button variant="outline">Export Data</Button></PopoverTrigger>
                    <PopoverContent >
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => exportData('json')}
                                disabled={!chartData.length}
                            >
                                Export to JSON
                            </Button>
                            <Button
                                onClick={() => exportData('xml')}
                                disabled={!chartData.length}
                            >
                                Export to XML
                            </Button>
                            <Button
                                onClick={() => exportData('yaml')}
                                disabled={!chartData.length}
                            >
                                Export to YAML
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>


            </div>

        </div>
    );
};

export default ComparisonPage;