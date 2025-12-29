'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilterSidebar } from '@/app/components/FilterSidebar';
import AddProjectForm from '@/app/components/AddProjectForm';
import { PlusIcon, Search, Eye, Edit, Trash2, BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter projects based on search term
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, searchTerm]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'on hold': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="flex flex-col md:flex-row animate-fade-in">
      <div className="md:w-auto w-full md:h-full">
        <FilterSidebar setProjects={setProjects} setCurrentPage={setCurrentPage} />
      </div>
      <div className="p-4 md:p-8 w-full h-full md:h-full overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Projects</h2>
            <p className="text-muted-foreground mt-1">Manage and track your projects</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="hover-lift">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="text-xl font-semibold">
                  Add a New Project
                </DialogTitle>
                <AddProjectForm
                  onProjectAdded={fetchProjects}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg skeleton"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow-lg rounded-xl border bg-card hover-lift">
              <table className="w-full table-auto text-sm text-left min-w-[600px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-foreground">Project Name</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Client</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Zone</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentProjects.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <BarChart3 className="h-8 w-8" />
                          <p>No projects found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentProjects.map((proj) => (
                      <tr key={proj._id} className="hover:bg-muted/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer"
                               onClick={() => { setSelectedProject(proj); setShowProjectDialog(true); }}>
                            {proj.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{proj.client}</td>
                        <td className="px-6 py-4 text-muted-foreground">{proj.zone}</td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(proj.status)}>
                            {proj.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setSelectedProject(proj); setShowProjectDialog(true); }}
                              className="hover:bg-accent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/projects/${proj._id}/edit`, '_blank')}
                              className="hover:bg-accent"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="hover-lift"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (page > totalPages) return null;
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-8 h-8 p-0 hover-lift"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="hover-lift"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Project Details
          </DialogTitle>
          {selectedProject && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                    <p className="text-foreground font-medium">{selectedProject.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client</label>
                    <p className="text-foreground">{selectedProject.client}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Zone</label>
                    <p className="text-foreground">{selectedProject.zone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {selectedProject.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-foreground">{selectedProject.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sector</label>
                    <p className="text-foreground">{selectedProject.sector}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-foreground">{selectedProject.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    <p className="text-foreground">{selectedProject.year}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Area</label>
                  <p className="text-foreground font-medium">{selectedProject.area} sq ft</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost</label>
                  <p className="text-foreground font-medium">₹{selectedProject.cost} Cr</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Progress</label>
                  <p className="text-foreground font-medium">{selectedProject.progress}%</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 hover-lift"
                  onClick={() => {
                    window.open(`/projects/${selectedProject._id}`, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 hover-lift"
                  onClick={() => {
                    window.open(`/projects/${selectedProject._id}/edit`, '_blank');
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

