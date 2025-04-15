"use client";

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  apiKey?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ 
    position: { lat: number; lng: number },
    title?: string
  }>;
  height?: string;
  width?: string;
  className?: string;
  onMapLoad?: (map: google.maps.Map) => void;
}

export function GoogleMap({
  center = { lat: -23.5505, lng: -46.6333 }, // São Paulo as default
  zoom = 15,
  markers = [],
  height = "400px",
  width = "100%",
  className = "",
  onMapLoad
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
      });

      setMap(mapInstance);
      
      if (onMapLoad) {
        onMapLoad(mapInstance);
      }
      
      // Add markers
      markers.forEach(marker => {
        new window.google.maps.Marker({
          position: marker.position,
          map: mapInstance,
          title: marker.title
        });
      });
    };

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Wait for the Google Maps API to load
      const mapLoadedCallback = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(mapLoadedCallback);
          initMap();
        }
      }, 100);
    }

    return () => {
      // Cleanup
    };
  }, [center, zoom, markers, onMapLoad]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width }} 
      className={`google-map ${className}`}
    />
  );
} 