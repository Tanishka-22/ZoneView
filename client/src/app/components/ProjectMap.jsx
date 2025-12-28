'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export function ProjectMap({ projects = [] }) {
  const [MarkerClusterGroup, setMarkerClusterGroup] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import marker cluster to avoid SSR issues
    import('react-leaflet-markercluster').then((mod) => {
      setMarkerClusterGroup(() => mod.default);
    }).catch(err => {
      console.error('Failed to load marker cluster:', err);
    });
  }, []);

  // Don't render on server
  if (!isClient || !MarkerClusterGroup) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // Dynamically import Leaflet for icon creation
  const L = require('leaflet');

  const center = [22.5937, 78.9629];

  const pinIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={5}
        minZoom={3}
        maxZoom={18}
        style={{ height: '100%', width: '100%' }}
        key="main-map" // Unique key to prevent container reuse
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
    </div>
  );
}

