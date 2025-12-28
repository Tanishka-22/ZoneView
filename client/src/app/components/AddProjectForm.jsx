'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function AddProjectForm({ onProjectAdded, initialData }) {
  const [formData, setFormData] = useState({
    name: '', zone: '', client: '', city: '', sector: '', type: '', year: '',
    area: '', cost: '', progress: '', status: '',
    designConsult: '', pmc: '', costConsult: '', projectManager: '',
    lat: '', lng: '', address: '',
  });

  const [sitePhotos, setSitePhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleFileChange = (e) => {
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
      document.querySelector('input[type="file"]').value = '';
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
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
        err?.response?.data?.error ||
        err?.message ||
        'Unknown error';
      alert('Error: ' + errorMsg);
    }
  };

  return (
    <div className="max-h-[90vh] flex flex-col bg-card rounded-xl shadow-xl border animate-scale-in">
      {/* Header */}
      <div className="p-6 border-b bg-background/95 backdrop-blur">
        <h2 className="text-2xl font-bold text-foreground">
          {initialData ? 'Edit Project' : 'Add New Project'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {initialData ? 'Update project details below' : 'Fill in the project information to get started'}
        </p>
      </div>

      {/* Scrollable Form */}
      <form id="project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Basic Info */}
        <div className="p-6 border rounded-xl space-y-6 bg-background/50 hover-lift">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-foreground">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Project Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                className="hover-lift"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Zone</Label>
              <Select onValueChange={(val) => handleSelectChange('zone', val)} value={formData.zone}>
                <SelectTrigger className="hover-lift">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.filter(z => z !== '').map(z => (
                    <SelectItem key={z} value={z}>{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Client *</Label>
              <Input
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Enter client name"
                className="hover-lift"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">City</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="hover-lift"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Sector</Label>
              <Select onValueChange={(val) => handleSelectChange('sector', val)} value={formData.sector}>
                <SelectTrigger className="hover-lift">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.filter(s => s !== '').map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Type</Label>
              <Select onValueChange={(val) => handleSelectChange('type', val)} value={formData.type}>
                <SelectTrigger className="hover-lift">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.filter(t => t !== '').map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Year</Label>
              <Select onValueChange={(val) => handleSelectChange('year', val)} value={formData.year}>
                <SelectTrigger className="hover-lift">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.filter(y => y !== '').map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Status</Label>
              <Select onValueChange={(val) => handleSelectChange('status', val)} value={formData.status}>
                <SelectTrigger className="hover-lift">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
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
        <div className="p-6 border rounded-xl space-y-6 bg-background/50 hover-lift">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-foreground">Financial Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Area (sq ft)</Label>
              <Input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter area"
                className="hover-lift"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Cost (₹ Cr)</Label>
              <Input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="Enter cost"
                className="hover-lift"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Progress (%)</Label>
              <Input
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                placeholder="Enter progress"
                min="0"
                max="100"
                className="hover-lift"
              />
            </div>
          </div>
        </div>

        {/* Consultants */}
        <div className="p-6 border rounded-xl space-y-6 bg-background/50 hover-lift">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-foreground">Consultants & Management</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Design Consultant</Label>
              <Input
                name="designConsult"
                value={formData.designConsult}
                onChange={handleChange}
                placeholder="Enter design consultant"
                className="hover-lift"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">PMC</Label>
              <Input
                name="pmc"
                value={formData.pmc}
                onChange={handleChange}
                placeholder="Enter PMC"
                className="hover-lift"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Cost Consultant</Label>
              <Input
                name="costConsult"
                value={formData.costConsult}
                onChange={handleChange}
                placeholder="Enter cost consultant"
                className="hover-lift"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Project Manager</Label>
              <Input
                name="projectManager"
                value={formData.projectManager}
                onChange={handleChange}
                placeholder="Enter project manager"
                className="hover-lift"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="p-6 border rounded-xl space-y-6 bg-background/50 hover-lift">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-foreground">Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Latitude</Label>
              <Input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Enter latitude"
                step="any"
                className="hover-lift"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Longitude</Label>
              <Input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Enter longitude"
                step="any"
                className="hover-lift"
              />
            </div>
            <div className="md:col-span-3 space-y-2">
              <Label className="text-sm font-medium text-foreground">Address</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="hover-lift"
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="p-6 border rounded-xl space-y-6 bg-background/50 hover-lift">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-foreground">Site Photos</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Upload Photos</Label>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hover-lift file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                accept="image/*"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Selected Files ({selectedFiles.length})</Label>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="hover-lift"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Photos
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Preview selected files before upload */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Preview</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/20">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className="w-full h-24 object-cover rounded-lg border hover-lift"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded photos */}
            {sitePhotos.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Uploaded Photos ({sitePhotos.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/20">
                  {sitePhotos.map((photo, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={photo.url}
                        alt={`photo-${idx}`}
                        className="w-full h-24 object-cover rounded-lg border hover-lift"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Form Footer */}
      <div className="p-6 border-t bg-muted/20 flex gap-3">
        <Button
          type="submit"
          form="project-form"
          className="flex-1 hover-lift"
          disabled={uploading}
        >
          {initialData?._id ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Project
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Project
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

