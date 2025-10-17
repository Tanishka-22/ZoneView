'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { IProject } from '@/types/project';

interface AddProjectFormProps {
  onProjectAdded?: () => void;
  initialData?: Partial<IProject>; // supports prefilled data
}

export default function AddProjectForm({ onProjectAdded, initialData }: AddProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '', zone: '', client: '', city: '', sector: '', type: '', year: '',
    area: '', cost: '', progress: '', status: '',
    designConsult: '', pmc: '', costConsult: '', projectManager: '',
    lat: '', lng: '', address: '',
  });

  const [sitePhotos, setSitePhotos] = useState<{ url: string; date: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const zones = ['North', 'South', 'East', 'West', 'Central'];
  const sectors = ['Commercial', 'Residential', 'Industrial', 'Institutional'];
  const types = ['HVAC', 'Electrical', 'Plumbing', 'Civil'];
  const statuses = ['Planned', 'Ongoing', 'Completed', 'On Hold'];
  const years = Array.from({ length: 2025 - 1996 + 1 }, (_, i) => (1996 + i).toString());

  // ✅ Prefill form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        zone: initialData.zone || '',
        client: initialData.client || '',
        city: initialData.city || '',
        sector: initialData.sector || '',
        type: initialData.type || '',
        year: initialData.year?.toString() || '',
        area: initialData.area?.toString() || '',
        cost: initialData.cost?.toString() || '',
        progress: initialData.progress?.toString() || '',
        status: initialData.status || '',
        designConsult: initialData.designConsult || '',
        pmc: initialData.pmc || '',
        costConsult: initialData.costConsult || '',
        projectManager: initialData.ProjectManager || '',
        lat: initialData.location?.lat?.toString() || '',
        lng: initialData.location?.lng?.toString() || '',
        address: initialData.location?.address || '',
      });
      setSitePhotos(initialData.sitePhotos || []);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    const data = new FormData();
    selectedFiles.forEach(file => data.append('images', file));
    try {
      const res = await api.post('/upload/photos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSitePhotos(res.data.photos);
      setSelectedFiles([]); // ✅ clear after upload
      (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log

    // Build payload
    const payload = {
      ...formData,
      area: Number(formData.area) || 0,
      cost: Number(formData.cost) || 0,
      progress: Number(formData.progress) || 0,
      year: Number(formData.year) || null,
      location: {
        lat: Number(formData.lat) || 0,
        lng: Number(formData.lng) || 0,
        address: formData.address,
      },
      sitePhotos,
    };

    try {
      if (initialData && initialData._id) {
        await api.put(`/projects/${initialData._id}`, payload);
        alert('Project updated!');
      } else {
        await api.post('/projects', payload);
        alert('Project created!');
        setFormData({
          name: '', zone: '', client: '', city: '', sector: '', type: '', year: '',
          area: '', cost: '', progress: '', status: '',
          designConsult: '', pmc: '', costConsult: '', projectManager: '',
          lat: '', lng: '', address: '',
        });
        setSitePhotos([]);
        setSelectedFiles([]);
      }
      if (onProjectAdded) onProjectAdded();
    } catch (err) {
      const errorMsg =
        (err as any)?.response?.data?.error ||
        (err as Error)?.message ||
        'Unknown error';
      alert('Error: ' + errorMsg);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Scrollable Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Basic Info */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label className='pb-2'>Project Name</Label><Input name="name" value={formData.name} onChange={handleChange} /></div>
            <div>
              <Label className='pb-2'>Zone</Label>
              <Select onValueChange={(val) => handleSelectChange('zone', val)} value={formData.zone}>
                <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
                <SelectContent>
                  {zones.filter(z => z !== '').map(z => (
                    <SelectItem key={z} value={z}>{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label className='pb-2'>Client</Label><Input name="client" value={formData.client} onChange={handleChange} /></div>
            <div><Label className='pb-2'>City</Label><Input name="city" value={formData.city} onChange={handleChange} /></div>
            <div>
              <Label className='pb-2'>Sector</Label>
              <Select onValueChange={(val) => handleSelectChange('sector', val)} value={formData.sector}>
                <SelectTrigger><SelectValue placeholder="Select Sector" /></SelectTrigger>
                <SelectContent>
                  {sectors.filter(s => s !== '').map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className='pb-2'>Type</Label>
              <Select onValueChange={(val) => handleSelectChange('type', val)} value={formData.type}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  {types.filter(t => t !== '').map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className='pb-2'>Year</Label>
              <Select onValueChange={(val) => handleSelectChange('year', val)} value={formData.year}>
                <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                <SelectContent>
                  {years.filter(y => y !== '').map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className='pb-2'>Status</Label>
              <Select onValueChange={(val) => handleSelectChange('status', val)} value={formData.status}>
                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>
                  {statuses.filter(s => s !== '').map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Financial */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">Financial Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><Label className='pb-2'>Area (sq ft)</Label><Input type="number" name="area" value={formData.area} onChange={handleChange} /></div>
            <div><Label className='pb-2'>Cost (₹)</Label><Input type="number" name="cost" value={formData.cost} onChange={handleChange} /></div>
            <div><Label className='pb-2'>Progress (%)</Label><Input type="number" name="progress" value={formData.progress} onChange={handleChange} /></div>
          </div>
        </div>

        {/* Consultants */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">Consultants & Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label className='pb-2'>Design Consultant</Label><Input name="designConsult" value={formData.designConsult} onChange={handleChange} /></div>
            <div><Label className='pb-2'>PMC</Label><Input name="pmc" value={formData.pmc} onChange={handleChange} /></div>
            <div><Label className='pb-2'>Cost Consultant</Label><Input name="costConsult" value={formData.costConsult} onChange={handleChange} /></div>
            <div><Label className='pb-2'>Project Manager</Label><Input name="projectManager" value={formData.projectManager} onChange={handleChange} /></div>
          </div>
        </div>

        {/* Location */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><Label className='pb-2'>Latitude</Label><Input type="number" name="lat" value={formData.lat} onChange={handleChange} /></div>
            <div><Label className='pb-2'>Longitude</Label><Input type="number" name="lng" value={formData.lng} onChange={handleChange} /></div>
            <div className="md:col-span-3"><Label>Address</Label><Input name="address" value={formData.address} onChange={handleChange} /></div>
          </div>
        </div>

        {/* Photos */}
        <>
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold text-lg">Site Photos</h3>
            <Input type="file" multiple onChange={handleFileChange} />
            <Button type="button" onClick={handleUpload} disabled={uploading} className="mt-2">
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </Button>

            {/* Preview selected files before upload */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {selectedFiles.map((file, idx) => (
                  <img key={idx} src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full rounded shadow" />
                ))}
              </div>
            )}

            {sitePhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {sitePhotos.map((photo, idx) => (
                  <img key={idx} src={photo.url} alt={`photo-${idx}`} className="w-full rounded shadow" />
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <Button type="submit" className="w-full" disabled={uploading}>
              {initialData?._id ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </>
      </form>
    </div>
  );
}
