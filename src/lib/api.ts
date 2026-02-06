import { ChargingStation, StationFilters, APIPoint, ReserveResponse, EmailReserveRequest, APIStation, StationStatus } from '@/types/station';
import axios from "axios";

//const API_BASE = 'http://ip:3000/api';

const API_BASE = `http://${import.meta.env.VITE_API_HOST}:3000/api`;

export const api = axios.create({
  baseURL: API_BASE,
});

// Transform API station response to ChargingStation format
function mapAPIStationToChargingStation(station: APIStation): ChargingStation {
  const status: StationStatus = station.available_points > 0 ? 'available' : 'charging';
  
  return {
    id: String(station.stationid),
    name: station.name,
    address: station.address,
    lat: parseFloat(station.lat),
    lng: parseFloat(station.lon),
    status,
    totalPoints: station.total_points,
    availablePoints: station.available_points,
  };
}

// GET /api/stations - Fetch stations for map
export async function fetchStations(filters: Partial<StationFilters>): Promise<ChargingStation[]> {
  const params = new URLSearchParams();
  
  // Map filters to API parameters based on stationRepository.js
  if (filters.availability !== null && filters.availability !== undefined) {
    params.append('availability', String(filters.availability));
  }
  if (filters.connectorType) {
    params.append('connector', filters.connectorType);
  }
  if (filters.fastCharging !== null && filters.fastCharging !== undefined) {
    params.append('fast', String(filters.fastCharging));
  }
  if (filters.priceRange) {
    params.append('minPrice', String(filters.priceRange[0]));
    params.append('maxPrice', String(filters.priceRange[1]));

  }

  if (filters.powerRange) {
    params.append('minCap', String(filters.powerRange[0])); // στέλνουμε "50" αν είναι 50 kW
    params.append('maxCap', String(filters.powerRange[1])); // στέλνουμε "150" αν είναι 150 kW
}
  const response = await fetch(`${API_BASE}/stations?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stations');
  }
  const stations: APIStation[] = await response.json();

  
  return stations.map(mapAPIStationToChargingStation);
}


// GET /api/stations/:id/points - Fetch points for a station
export async function fetchStationPoints(stationId: string): Promise<APIPoint[]> {
  const response = await fetch(`${API_BASE}/stations/${stationId}/points`);
  if (!response.ok) {
    throw new Error('Failed to fetch station points');
  }
  return response.json();
}

// POST /api/emailreserve - Reserve with email confirmation
export async function emailReserve(request: EmailReserveRequest): Promise<ReserveResponse> {
  const response = await fetch(`${API_BASE}/emailreserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to reserve');
  }
  
  return response.json();
}

// POST /api/reserve/:id/:time - Simple reserve without email
export async function reserveStation(pointId: string, time?: number): Promise<ReserveResponse> {
  const url = time 
    ? `${API_BASE}/reserve/${pointId}/${time}`
    : `${API_BASE}/reserve/${pointId}`;
  
  const response = await fetch(url, { method: 'POST' });
  if (!response.ok) {
    throw new Error('Failed to reserve station');
  }
  return response.json();
}
