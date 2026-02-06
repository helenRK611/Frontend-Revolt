export type StationStatus = 'available' | 'charging' | 'offline' | 'reserved'| 'malfunction';

export type ConnectorType = 
  | 'CCS2' 
  | 'CHAdeMO' 
  | 'Type2' 
  | 'Caravan Mains Socket' 
  | 'CCS1' 
  | 'J-1772' 
  | 'Three Phase EU' 
  | 'Type 2' 
  | 'Type 3' 
  | 'Type 3A' 
  | 'Wall (Euro)';

// Alias for backwards compatibility
export type ChargerType = ConnectorType;

// API Response from GET /api/stations
export interface APIStation {
  stationid: number;
  name: string;
  address: string;
  lat: string;
  lon: string;
  total_points: number;
  available_points: number;
}

// API Response from GET /api/stations/:id/points
export interface APIPoint {
  pointid: number;
  connector_type: ConnectorType;
  cap: number;
  status: StationStatus;
  kwhprice: number;
  fast_charger: boolean;
  reservationendtime: string | null;
}


export interface StationPanelProps {
  station: ChargingStation | null;
  onClose: () => void;
}

// Frontend ChargingStation for map display
export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: StationStatus;
  totalPoints: number;
  availablePoints: number;
}

// Frontend filters matching API capabilities
export interface StationFilters {
  // availability: true = only stations with available points
  availability: boolean | null;
  // connector type filter
  connectorType: ConnectorType | null;
  // fast charging filter
  fastCharging: boolean | null;
  // price range
  priceRange: [number, number];
  // kW power range
  powerRange: [number, number];
}

// API Response from POST /api/emailreserve
export interface ReserveResponse {
  pointid: number;
  status: StationStatus;
  reservationendtime: string | null;
}

// Request body for POST /api/emailreserve
export interface EmailReserveRequest {
  pointid: number;
  email: string;
  minutes: number;
}
