import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ChargingStation, StationStatus } from '@/types/station';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, HelpCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Map tile URLs for light and dark modes
const LIGHT_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

interface ChargingMapProps {
  stations: ChargingStation[];
  onReserve: (pointId: string, time?: number) => void;
  isReserving: boolean;
  onToggleFilters: () => void;
  onToggleHelp: () => void;
  onStationClick: (station: ChargingStation) => void;
}

// Default center: Greece
const DEFAULT_CENTER: L.LatLngExpression = [39.0, 22.0];
const DEFAULT_ZOOM = 7;

// Greece bounds - restrict map to Greece only
const GREECE_BOUNDS: L.LatLngBoundsExpression = [
  [34.5, 19.0], // Southwest
  [42.0, 30.0], // Northeast
];

const statusColors: Record<StationStatus, string> = {
  available: '#22c55e',
  charging: '#eab308',
  offline: '#ef4444',
  reserved: '#f97316',
  malfunction: '#8e12f2'
};

export function ChargingMap({ stations, onReserve, isReserving, onToggleFilters, onToggleHelp, onStationClick }: ChargingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: false });
      mapInstanceRef.current.invalidateSize();
      return;
    }

    const isDark = document.documentElement.classList.contains('dark');
    const tileUrl = isDark ? DARK_TILE_URL : LIGHT_TILE_URL;

    const map = L.map(mapRef.current, {
      maxBounds: GREECE_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 7,
      maxZoom: 18,
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    
    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    mapInstanceRef.current = map;
    tileLayerRef.current = tileLayer;
    setMapReady(true);

    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && mapInstanceRef.current && tileLayerRef.current) {
          const isDarkNow = document.documentElement.classList.contains('dark');
          const newTileUrl = isDarkNow ? DARK_TILE_URL : LIGHT_TILE_URL;
          tileLayerRef.current.setUrl(newTileUrl);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update markers when stations change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers with count badge
    stations.forEach((station) => {
      const hasAvailable = station.availablePoints > 0;
      const color = hasAvailable ? statusColors.available : statusColors.offline;
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            position: relative;
            cursor: pointer;
          ">
            
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              background: ${hasAvailable ? '#22c55e' : '#ef4444'};
              color: white;
              font-size: 10px;
              font-weight: 600;
              padding: 1px 4px;
              border-radius: 8px;
              white-space: nowrap;
              box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            ">${station.availablePoints}/${station.totalPoints}</div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 25],
      });

      const marker = L.marker([station.lat, station.lng], { icon })
        .addTo(mapInstanceRef.current!);
      
      // Add tooltip with station name and address
      marker.bindTooltip(`
        <div style="text-align: center;">
          <strong>${station.name}</strong><br/>
          <span style="font-size: 12px; color: #666;">${station.address}</span>
        </div>
      `, {
        direction: 'top',
        offset: [0, -20],
        className: 'station-tooltip',
      });
      
      (marker as any).stationData = station;
      
      marker.on('click', () => {
        onStationClick(station);
      });

      markersRef.current.push(marker);
    });
  }, [stations, mapReady, onStationClick]);

  return (
    <div className="relative h-full w-full">
      {/* Map container - adjusted for top bar */}
      <div 
        ref={mapRef} 
        className="h-full w-full pt-14"
        style={{ minHeight: '100vh' }}
      />

      {/* Filter toggle button - top right, below top bar */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-20 right-4 z-[1000] h-12 w-12 rounded-full shadow-lg backdrop-blur-md bg-card/80 dark:bg-card/70 border-border/50 hover:bg-accent hover:scale-105 transition-all duration-200"
        onClick={onToggleFilters}
      >
        <SlidersHorizontal className="h-5 w-5 text-foreground" />
      </Button>

      {/* Help button - below filter button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-36 right-4 z-[1000] h-12 w-12 rounded-full shadow-lg backdrop-blur-md bg-card/80 dark:bg-card/70 border-border/50 hover:bg-accent hover:scale-105 transition-all duration-200"
        onClick={onToggleHelp}
        aria-label="Βοήθεια"
      >
        <HelpCircle className="h-5 w-5 text-foreground" />
      </Button>
    </div>
  );
}
