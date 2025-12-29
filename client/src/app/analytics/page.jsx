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
PointElement,
ArcElement,
Tooltip,
Legend,
} from 'chart.js';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign } from 'lucide-react';

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
LineElement,
PointElement,
ArcElement,
Tooltip,
Legend
);

export default function AnalyticsPage() {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchAnalytics();
}, []);

const fetchAnalytics = async () => {
  try {
    setLoading(true);
    const res = await api.get('/analytics/summary');
    setData(res.data);
  } catch (error) {
    console.error('Error fetching analytics:', error);
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-4 skeleton"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg skeleton"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
          <div className="col-span-1 md:col-span-3 h-64 bg-muted rounded-lg skeleton"></div>
          <div className="col-span-1 md:col-span-3 h-64 bg-muted rounded-lg skeleton"></div>
          <div className="col-span-1 md:col-span-2 h-64 bg-muted rounded-lg skeleton"></div>
        </div>
      </div>
    </div>
  );
}

if (!data) return <p className="p-6">Error loading analytics...</p>;

return (
<div className="p-4 md:p-8 space-y-8 overflow-auto h-full animate-fade-in">
<h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
<p className="text-muted-foreground mb-8">Comprehensive insights into the project portfolio</p>

    {/* KPI Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <Card className="hover-lift animate-scale-in" style={{animationDelay: '0.1s'}}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-foreground">{data.totalProjects}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="hover-lift animate-scale-in" style={{animationDelay: '0.2s'}}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Value</p>
            <p className="text-3xl font-bold text-foreground">₹{data.totalValue} Cr</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="hover-lift animate-scale-in" style={{animationDelay: '0.3s'}}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Delayed Projects</p>
            <p className="text-3xl font-bold text-foreground">{data.delayed}</p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="hover-lift animate-scale-in" style={{animationDelay: '0.4s'}}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Avg Progress</p>
            <p className="text-3xl font-bold text-foreground">{data.avgProgress}%</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
    {/* Zone-wise Project Count */}
    <Card className="col-span-1 md:col-span-3 hover-lift animate-scale-in" style={{animationDelay: '0.5s'}}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Projects by Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Bar
          data={{
            labels: Object.keys(data.zoneCounts),
            datasets: [{
              label: 'Projects',
              data: Object.values(data.zoneCounts),
              backgroundColor: '#0077B6', // blue bars
              borderRadius: 4,
              borderSkipped: false,
            }],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
              },
              x: {
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
              }
            }
          }}
        />
      </CardContent>
    </Card>

    {/* Status Breakdown*/}
    <Card className="col-span-1 md:col-span-3 hover-lift animate-scale-in" style={{animationDelay: '0.6s'}}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Completions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Line
          data={{
            labels: Object.keys(data.monthlyCounts),
            datasets: [{
              label: 'Projects Completed',
              data: Object.values(data.monthlyCounts),
              borderColor: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              tension: 0.4,
              fill: true,
            }],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
              },
              x: {
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
              }
            }
          }}
        />
      </CardContent>
    </Card>

    {/* Monthly Completions stacked */}
    <Card className="col-span-1 md:col-span-2 hover-lift animate-scale-in" style={{animationDelay: '0.7s'}}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Pie
          data={{
            labels: Object.keys(data.statusCounts),
            datasets: [{
              label: 'Status',
              data: Object.values(data.statusCounts),
              backgroundColor: Object.keys(data.statusCounts).map(status => {
                switch (status?.toLowerCase()) {
                  case 'completed': return '#22c55e'; // vibrant green
                  case 'ongoing': return '#3b82f6'; // vibrant blue
                  case 'delayed': return '#ef4444'; // vibrant red
                  case 'planned': return '#f59e0b'; // vibrant amber
                  default: return '#6b7280'; // gray
                }
              }),
              borderWidth: 0,
            }],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: 'hsl(var(--foreground))' }
              },
            }
          }}
        />
      </CardContent>
    </Card>
  </div>

  {/* Table: Top Projects - full width below */}
  <Card className="hover-lift animate-scale-in" style={{animationDelay: '0.8s'}}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Top 5 High-Value Projects
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Project Name</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Client</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Value (₹ Cr)</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Progress</th>
            </tr>
          </thead>
          <tbody>
            {data.topProjects.map((p, index) => (
              <tr key={p._id} className="border-b border-border hover:bg-muted/50 transition-colors animate-fade-in" style={{animationDelay: `${0.9 + index * 0.1}s`}}>
                <td className="py-3 px-4 text-foreground font-medium">{p.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{p.client}</td>
                <td className="py-3 px-4 text-foreground font-semibold">{p.cost}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{p.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</div>
);
}

