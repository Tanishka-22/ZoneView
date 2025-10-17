'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IProject } from '@/types/project';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddProjectForm from '@/app/components/AddProjectForm';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    if (params?.id) {
      api.get(`/projects/${params.id}`)
        .then(res => setProject(res.data))
        .catch(err => {
          console.error('Error fetching project:', err);
          console.log('Error fetching project:');
          setProject(null); // So UI can show "Not Found"
        })
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!project) return <p className="p-6">Project not found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <div className="flex gap-2">
          {/* Edit Project button */}
          <Button onClick={() => setShowEditDialog(true)}>Edit Project</Button>

          {/* Open in New Tab button */}
          <Button variant="outline" onClick={() => window.open(`/projects/${project._id}`, '_blank')}>
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Showcase format */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Zone:</strong> {project.zone}</p>
            <p><strong>Client:</strong> {project.client}</p>
            <p><strong>City:</strong> {project.city}</p>
            <p><strong>Sector:</strong> {project.sector}</p>
            <p><strong>Type:</strong> {project.type}</p>
            <p><strong>Year:</strong> {project.year}</p>
            <p><strong>Area:</strong> {project.area} sq ft</p>
            <p><strong>Cost:</strong> ₹{project.cost}</p>
            <p><strong>Progress:</strong> {project.progress}%</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Design Consultant:</strong> {project.designConsult}</p>
            <p><strong>PMC:</strong> {project.pmc}</p>
            <p><strong>Cost Consultant:</strong> {project.costConsult}</p>
            <p><strong>Project Manager:</strong> {project.ProjectManager}</p>
            <p><strong>Latitude:</strong> {project.location?.lat}</p>
            <p><strong>Longitude:</strong> {project.location?.lng}</p>
            <p className="md:col-span-2"><strong>Address:</strong> {project.location?.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Site Photos */}
      {project.sitePhotos?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Site Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.sitePhotos.map((photo, i) => (
              <img key={i} src={photo.url} alt={`photo-${i}`} className="rounded shadow" />
            ))}
          </div>
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogTitle>Edit Project</DialogTitle>
          <AddProjectForm
            initialData={project}
            onProjectAdded={() => {
              api.get(`/projects/${params.id}`).then(res => setProject(res.data));
              setShowEditDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
