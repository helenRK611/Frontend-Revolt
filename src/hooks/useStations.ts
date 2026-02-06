import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStations, fetchStationPoints, emailReserve, reserveStation } from '@/lib/api';
import { StationFilters, EmailReserveRequest } from '@/types/station';

export function useStations(filters: Partial<StationFilters>) {
  return useQuery({
    queryKey: ['stations', filters],
    queryFn: () => fetchStations(filters),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
}

export function useStationPoints(stationId: string | null) {
  return useQuery({
    queryKey: ['stationPoints', stationId],
    queryFn: () => fetchStationPoints(stationId!),
    enabled: !!stationId,
    staleTime: 10000,
  });
}

export function useEmailReserve() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: EmailReserveRequest) => emailReserve(request),
    onSuccess: () => {
      // Immediate refetch after reservation - only this client
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['stationPoints'] });
    },
  });
}

export function useReserveStation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ pointId, time }: { pointId: string; time?: number }) => 
      reserveStation(pointId, time),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['stationPoints'] });
    },
  });
}
