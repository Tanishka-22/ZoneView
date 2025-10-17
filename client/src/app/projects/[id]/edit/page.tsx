'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import AddProjectForm from '@/app/components/AddProjectForm';
import { IProject } from '@/types/project';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);

  useEffect(() => {
    if (params?.id) {
      api.get(`/projects/${params.id}`)
        .then(res => setProject(res.data));
    }
  }, [params?.id]);

  if (!project) return <p className="p-6">Loading...</p>;

  return (
    <AddProjectForm
      onProjectAdded={() => router.push(`/projects/${params.id}`)}
      initialData={project} // Pass prefill data
    />
  );
}
