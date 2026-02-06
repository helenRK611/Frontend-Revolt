import { useState } from 'react';
import { ChargingMap } from '@/components/map/ChargingMap';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { StationPanel } from '@/components/station/StationPanel';
import { HelpSidebar } from '@/components/help/HelpSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { StationFilters, ChargingStation } from '@/types/station';
import { useStations } from '@/hooks/useStations';
import { useReservationSocket } from '@/hooks/useReservationSocket';

const DEFAULT_FILTERS: StationFilters = {
  availability: null,
  connectorType: null,
  fastCharging: null,
  priceRange: [0, 1],
  powerRange: [2, 350],
};

const Index = () => {
  const [filters, setFilters] = useState<StationFilters>(DEFAULT_FILTERS);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  
  const { data: stations = [] } = useStations(filters);
  
  // Connect to WebSocket for real-time reservation updates
  useReservationSocket();

  const handleStationClick = (station: ChargingStation) => {
    setIsFiltersOpen(false);
    setIsHelpOpen(false);
    setSelectedStation(station);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <TopBar />
      <ChargingMap
        stations={stations}
        onReserve={() => {}}
        isReserving={false}
        onToggleFilters={() => {
          setSelectedStation(null);
          setIsHelpOpen(false);
          setIsFiltersOpen(!isFiltersOpen);
        }}
        onToggleHelp={() => {
          setSelectedStation(null);
          setIsFiltersOpen(false);
          setIsHelpOpen(!isHelpOpen);
        }}
        onStationClick={handleStationClick}
      />
      <FilterSidebar 
        filters={filters} 
        onFiltersChange={setFilters}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
      <HelpSidebar
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
      <StationPanel
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </div>
  );
};

export default Index;
