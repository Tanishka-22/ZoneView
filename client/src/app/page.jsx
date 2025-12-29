'use client';

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FilterSidebar } from "@/app/components/FilterSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, BarChart3, TrendingUp, Loader2 } from "lucide-react";

const ProjectMap = dynamic(
  () => import("../app/components/ProjectMap").then((mod) => mod.ProjectMap),
  { ssr: false }
);

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalValue: 0,
    activeProjects: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data.projects);

      // Calculate basic stats
      const totalProjects = res.data.projects.length;
      const totalValue = res.data.projects.reduce((sum, p) => sum + (parseFloat(p.cost) || 0), 0);
      const activeProjects = res.data.projects.filter(p => p.status?.toLowerCase() === 'ongoing').length;

      setStats({
        totalProjects,
        totalValue: totalValue.toFixed(1),
        activeProjects
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen animate-fade-in">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r md:border-r">
        <FilterSidebar setProjects={setProjects} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Stats Cards */}
        {/* <div className="p-2 md:p-3 border-b bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="hover-lift animate-scale-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalProjects}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-scale-in" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `₹${stats.totalValue} Cr`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-scale-in" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeProjects}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div> */}

        {/* Map */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-[70vh] md:h-full w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading project map...</p>
                </div>
              </div>
            ) : (
              <ProjectMap projects={projects} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

