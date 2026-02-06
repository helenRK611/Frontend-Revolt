import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const WS_URL = 'ws://localhost:3000';

export function useReservationSocket() {
  const queryClient = useQueryClient();

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      // When a reservation update is received, invalidate queries
      if (data.type === 'reservation-update' || data.type === 'point-update') {
        console.log('Reservation update received:', data);
        queryClient.invalidateQueries({ queryKey: ['stations'] });
        queryClient.invalidateQueries({ queryKey: ['stationPoints'] });
      }
    } catch (error) {
      console.error('WebSocket message parse error:', error);
    }
  }, [queryClient]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = handleMessage;

        ws.onclose = () => {
          console.log('WebSocket disconnected, reconnecting in 5s...');
          reconnectTimeout = setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
          console.log('WebSocket error, will retry...');
          ws?.close();
        };
      } catch (error) {
        console.log('WebSocket connection failed, retrying in 5s...');
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [handleMessage]);
}
