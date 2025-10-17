'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
Card,
CardHeader,
CardTitle,
CardContent,
} from '@/components/ui/card';
import {
Bar,
Line,
Pie
} from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement, // <-- Add this
ArcElement,
Tooltip,
Legend,
} from 'chart.js';

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement, // <-- Add this
ArcElement,
Tooltip,
Legend
);

export default function AnalyticsPage() {
const [data, setData] = useState<any>(null);

useEffect(() => {
api.get('/analytics/summary').then((res) => {
setData(res.data);
});
}, []);

if (!data) return <p className="p-6">Loading analytics...</p>;

return (
<div className="p-6 space-y-8">
<h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
    {/* KPI Summary Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">Total Projects</p>
        <p className="text-xl font-bold">{data.totalProjects}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">Total Value (₹ Cr)</p>
        <p className="text-xl font-bold">{data.totalValue}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">Delayed Projects</p>
        <p className="text-xl font-bold">{data.delayed}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">Avg Progress</p>
        <p className="text-xl font-bold">{data.avgProgress}%</p>
      </CardContent>
    </Card>
  </div>

  {/* Chart: Zone-wise Project Count */}
  <Card>
    <CardHeader>
      <CardTitle>Projects by Zone</CardTitle>
    </CardHeader>
    <CardContent>
      <Bar
        data={{
          labels: Object.keys(data.zoneCounts),
          datasets: [{
            label: 'Projects',
            data: Object.values(data.zoneCounts),
            backgroundColor: 'rgb(59 130 246)',
          }],
        }}
      />
    </CardContent>
  </Card>

  {/* Chart: Status Breakdown */}
  <Card>
    <CardHeader>
      <CardTitle>Status Breakdown</CardTitle>
    </CardHeader>
    <CardContent>
      <Pie
        data={{
          labels: Object.keys(data.statusCounts),
          datasets: [{
            label: 'Status',
            data: Object.values(data.statusCounts),
            backgroundColor: ['#34d399', '#f87171', '#60a5fa', '#fbbf24'],
          }],
        }}
      />
    </CardContent>
  </Card>

  {/* Chart: Monthly Completions */}
  <Card>
    <CardHeader>
      <CardTitle>Monthly Completions</CardTitle>
    </CardHeader>
    <CardContent>
      <Line
        data={{
          labels: Object.keys(data.monthlyCounts),
          datasets: [{
            label: 'Projects Completed',
            data: Object.values(data.monthlyCounts),
            borderColor: '#4f46e5',
            backgroundColor: '#6366f1',
          }],
        }}
      />
    </CardContent>
  </Card>

  {/* Table: Top Projects */}
  <Card>
    <CardHeader>
      <CardTitle>Top 5 High-Value Projects</CardTitle>
    </CardHeader>
    <CardContent>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Client</th>
            <th className="text-left py-2">₹ Cr</th>
            <th className="text-left py-2">Progress</th>
          </tr>
        </thead>
        <tbody>
          {data.topProjects.map((p: any) => (
            <tr key={p._id} className="border-b">
              <td className="py-2">{p.name}</td>
              <td className="py-2">{p.client}</td>
              <td className="py-2">{p.cost}</td>
              <td className="py-2">{p.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
</div>
);
}