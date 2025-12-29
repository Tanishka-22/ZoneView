'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

export default function DynamicMap({ projects = [] }) {
  const [L, setL] = useState(null);
  const [pinIcon, setPinIcon] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // Import Leaflet dynamically
    import('leaflet').then((leaflet) => {
      if (!isMounted) return;

      setL(leaflet.default);

      // Create custom icon
      const icon = new leaflet.default.Icon({
        iconUrl: '/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
      setPinIcon(icon);
    }).catch((error) => {
      console.error('Failed to load Leaflet:', error);
    });

    // Handle window resize for mobile
    const handleResize = () => {
      if (mapRef.current && isMounted) {
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Invalidate map size after component mounts and L/pinIcon are loaded
    if (mapRef.current && L && pinIcon) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 200);
    }
  }, [L, pinIcon]);

  if (!L || !pinIcon) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const center = [22.5937, 78.9629];

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={5}
      minZoom={3}
      maxZoom={18}
      style={{ height: '100%', width: '100%' }}
      key={`map-${Date.now()}`} // Unique key to prevent container reuse
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {projects
          .filter(project => project.location?.lat && project.location?.lng)
          .map((project) => (
            <Marker
              key={project._id}
              position={[project.location.lat, project.location.lng]}
              icon={pinIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{project.name}</h3>
                  <p className="text-xs text-muted-foreground">{project.client}</p>
                  <p className="text-xs">{project.zone}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}