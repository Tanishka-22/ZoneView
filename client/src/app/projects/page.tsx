'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { IProject } from '@/types/project';
import { Button } from '@/components/ui/button';
import { FilterSidebar } from '@/app/components/FilterSidebar';
import AddProjectForm from '@/app/components/AddProjectForm';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ProjectList() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  useEffect(() => {
    api.get('/projects').then(res => {
      setProjects(res.data.projects);
    });
  }, []);

  const totalPages = Math.max(1, Math.ceil(projects.length / projectsPerPage));
  const currentProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex">
      <div className="ph-4 pv-2">
        <FilterSidebar setProjects={setProjects} setCurrentPage={setCurrentPage} />
      </div>
      <div className="p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>
                Add a New Project
              </DialogTitle>
              <AddProjectForm
                onProjectAdded={() => {
                  api.get('/projects').then(res => {
                    setProjects(res.data.projects);
                    setCurrentPage(1);
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto shadow rounded-lg border bg-white">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Zone</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentProjects.map((proj) => (
                <tr key={proj._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-blue-600 font-medium cursor-pointer"
                      onClick={() => { setSelectedProject(proj); setShowProjectDialog(true); }}>
                    {proj.name}
                  </td>
                  <td className="px-6 py-4">{proj.client}</td>
                  <td className="px-6 py-4">{proj.zone}</td>
                  <td className="px-6 py-4">{proj.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent>
          <DialogTitle>Project Details</DialogTitle>
          {selectedProject && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedProject.name}</p>
              <p><strong>Client:</strong> {selectedProject.client}</p>
              <p><strong>Zone:</strong> {selectedProject.zone}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>City:</strong> {selectedProject.city}</p>
              <p><strong>Sector:</strong> {selectedProject.sector}</p>
              <p><strong>Type:</strong> {selectedProject.type}</p>
              <p><strong>Year:</strong> {selectedProject.year}</p>
              <p><strong>Area:</strong> {selectedProject.area}</p>
              <p><strong>Cost:</strong> {selectedProject.cost}</p>
              <p><strong>Progress:</strong> {selectedProject.progress}</p>
              <p><strong>Design Consultant:</strong> {selectedProject.designConsult}</p>
              <p><strong>PMC:</strong> {selectedProject.pmc}</p>
              <p><strong>Cost Consultant:</strong> {selectedProject.costConsult}</p>
              <p><strong>Project Manager:</strong> {selectedProject.ProjectManager}</p>
              <p><strong>Address:</strong> {selectedProject.location?.address}</p>
    
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  window.open(`/projects/${selectedProject._id}`, '_blank');
                }}
              >
                Open in New Tab
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}