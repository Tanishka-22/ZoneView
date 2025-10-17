'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { useEffect, useState } from 'react';
import { IProject } from '@/types/project';

interface ProjectMapProps {
  projects: IProject[];
}

export function ProjectMap({ projects = [] }: ProjectMapProps) {
  const [MarkerClusterGroup, setMarkerClusterGroup] = useState<any>(null);

  useEffect(() => {
    import('react-leaflet-markercluster').then((mod) => {
      setMarkerClusterGroup(() => mod.default);
    });
  }, []);

  if (!MarkerClusterGroup) return null;

  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  const L = require('leaflet');

  const center: [number, number] = [22.5937, 78.9629];

  const pinIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup>
        {(projects ?? []).map((project) =>
          project.location?.lat && project.location?.lng ? (
            <Marker
              key={project._id}
              position={[project.location.lat, project.location.lng]}
              icon={pinIcon}
            >
              <Popup>
                <div>
                  <strong>{project.name}</strong>
                  <br />
                  {project.client}
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
