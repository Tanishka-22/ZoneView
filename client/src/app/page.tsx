'use client';

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FilterSidebar } from "@/app/components/FilterSidebar";
import { IProject } from "@/types/project";

const ProjectMap = dynamic(
  () => import("../app/components/ProjectMap").then((mod) => mod.ProjectMap),
  { ssr: false }
);

export default function HomePage() {
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    api.get('/projects').then(res => {
      setProjects(res.data.projects);
    });
  }, []);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <FilterSidebar setProjects={setProjects} />
      </div>

      {/* Map */}
      <div className="flex-1 overflow-hidden">
        <ProjectMap projects={projects} />
      </div>
    </div>
  );
}
