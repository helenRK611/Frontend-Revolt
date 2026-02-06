import { useState } from 'react';
import { ChargingStation, APIPoint, ConnectorType, StationStatus, StationPanelProps } from '@/types/station';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ChevronLeft, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStationPoints, useEmailReserve } from '@/hooks/useStations';
import { SuccessPanel } from './SuccessPanel';




const statusLabels: Record<StationStatus, string> = {
  available: 'Διαθέσιμος',
  charging: 'Σε χρήση',
  offline: 'Εκτός δικτύου',
  reserved: 'Κρατημένος',
  malfunction: 'Εκτός λειτουργίας'
};

const statusColors: Record<StationStatus, string> = {
  available: 'text-green-600',
  charging: 'text-yellow-600',
  offline: 'text-red-600',
  reserved: 'text-orange-600',
  malfunction: 'text-purple-600'
};

const statusBgColors: Record<StationStatus, string> = {
  available: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
  charging: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800',
  offline: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
  reserved: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
  malfunction: 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800',

};

const RESERVATION_TIMES = [5, 10, 15, 20, 25, 30, 45, 60];

type ViewState = 'types' | 'chargers' | 'reservation';

export function StationPanel({ station, onClose }: StationPanelProps) {
  const [view, setView] = useState<ViewState>('types');
  const [selectedType, setSelectedType] = useState<ConnectorType | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<APIPoint | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [reserveError, setReserveError] = useState('');
  const [reservationMinutes, setReservationMinutes] = useState(30);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  const { data: points = [] } = useStationPoints(station?.id || null);
  const emailReserveMutation = useEmailReserve();

  if (!station) return null;

  // Group points by connector type
  const pointsByType = points.reduce((acc, point) => {
    const type = point.connector_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(point);
    return acc;
  }, {} as Record<ConnectorType, APIPoint[]>);

  const connectorTypes = Object.keys(pointsByType) as ConnectorType[];
  const pointsOfSelectedType = selectedType ? (pointsByType[selectedType] || []) : [];
  const availableOfType = pointsOfSelectedType.filter(p => p.status === 'available').length;

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Το email είναι υποχρεωτικό');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Μη έγκυρο email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleTypeClick = (type: ConnectorType) => {
    setSelectedType(type);
    setView('chargers');
  };

  const handlePointClick = (point: APIPoint) => {
    if (point.status === 'available') {
      setSelectedPoint(point);
      setView('reservation');
    }
  };

  const handleBack = () => {
    if (view === 'reservation') {
      setSelectedPoint(null);
      setEmail('');
      setEmailError('');
      setReserveError(''); 
      setView('chargers');
    } else if (view === 'chargers') {
      setSelectedType(null);
      setView('types');
    }
  };

  const handleReserve = async () => {
    if (!selectedPoint) return;
    if (!validateEmail(email)) return;

    try {
      await emailReserveMutation.mutateAsync({
        pointid: selectedPoint.pointid,
        email: email,
        minutes: reservationMinutes,
      });
      
      setSuccessEmail(email);
      setShowSuccess(true);
      
      //setSelectedPoint(null);
      setSelectedType(null);
      setEmail('');
      setView('types');
    } catch (error: any) {
  setReserveError('Παρουσιάστηκε σφάλμα. Βεβαιωθείται ότι δεν έχετε τρέχουσα κράτηση σε αυτό το email. Δοκίμασε ξανά.');
}};

  const handleClose = () => {
    setView('types');
    setSelectedType(null);
    setSelectedPoint(null);
    setReserveError(''); 
    setEmail('');
    setEmailError('');
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSuccessEmail('');
    setSelectedPoint(null); 
    onClose();
  };

  // Success modal
 if (showSuccess && selectedPoint) {
     return (
  <SuccessPanel
  email={successEmail}
  point={selectedPoint}
  stationAddress={station.address}
  reservationMinutes={reservationMinutes}
  onClose={handleSuccessClose}
/>
  );
}

  // Reservation view with email input
  if (view === 'reservation' && selectedPoint) {
    return (
      <div className="absolute right-0 top-14 z-[1000] h-[calc(100%-3.5rem)] w-full sm:w-[400px] animate-slide-in-right">
        <Card className="h-full rounded-none border-l shadow-xl overflow-auto backdrop-blur-xl bg-card/90 dark:bg-card/80 border-l-border/50">
          <CardHeader className="pb-4 pt-6">
            <CardTitle className="text-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span>Κράτηση</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 px-6">
            <div className="p-4 bg-muted rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-lg font-medium">
                {selectedPoint.connector_type}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono font-medium">{selectedPoint.pointid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Τιμή:</span>
                  <span className="font-medium">{selectedPoint.kwhprice.toFixed(2)} €/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ισχύς:</span>
                  <span className="font-medium">{selectedPoint.cap} kW</span>
                </div>
                {selectedPoint.fast_charger && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground"></span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg dark:bg-yellow-900 dark:text-yellow-200">
                      Ταχεία φόρτιση
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email επιβεβαίωσης
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setReserveError('');
                  if (emailError) validateEmail(e.target.value);
                }}
                className={cn(
                  "h-10",
                  emailError && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {emailError && (
                <p className="text-red-500 text-xs">{emailError}</p>
              )}

              {reserveError && (
               <p className="text-red-500 text-xs">{reserveError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Διάρκεια κράτησης</Label>
              <Select 
                value={reservationMinutes.toString()} 
                onValueChange={(v) => setReservationMinutes(parseInt(v))}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESERVATION_TIMES.map((mins) => (
                    <SelectItem key={mins} value={mins.toString()}>
                      {mins} λεπτά
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Θα πρέπει να φτάσεις εντός αυτού του χρόνου
              </p>
            </div>

            <div className="border-t pt-4">
              <Button 
                className="w-full h-10" 
                onClick={handleReserve}
                disabled={emailReserveMutation.isPending || !email}
              >
                {emailReserveMutation.isPending ? 'Κράτηση...' : `Κράτηση (${reservationMinutes} λεπτά)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chargers of selected type view
  if (view === 'chargers' && selectedType) {
    return (
      <div className="absolute right-0 top-14 z-[1000] h-[calc(100%-3.5rem)] w-full sm:w-[400px] animate-slide-in-right">
        <Card className="h-full rounded-none border-l shadow-xl overflow-auto backdrop-blur-xl bg-card/90 dark:bg-card/80 border-l-border/50">
          <CardHeader className="pb-4 pt-6">
            <CardTitle className="text-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span>⚡ {selectedType}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            <div className="text-sm text-muted-foreground">
              {availableOfType} / {pointsOfSelectedType.length} διαθέσιμοι
            </div>

            {availableOfType > 0 && (
              <p className="text-xs text-muted-foreground">
                Πάτησε σε διαθέσιμο φορτιστή για κράτηση
              </p>
            )}

            <div className="space-y-3">
              {pointsOfSelectedType.map((point) => (
                <div 
                  key={point.pointid}
                  onClick={() => handlePointClick(point)}
                  className={cn(
                    "p-4 rounded-xl border transition-colors",
                    statusBgColors[point.status],
                    point.status === 'available' 
                      ? "cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40" 
                      : "cursor-not-allowed opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-base">
                        Φορτιστής #{point.pointid}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {point.cap} kW • {point.kwhprice.toFixed(2)} €/kWh
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-medium",
                        statusColors[point.status]
                      )}>
                        {statusLabels[point.status]}
                      </div>
                      {point.fast_charger && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-lg dark:bg-yellow-900 dark:text-yellow-200">
                          Ταχεία
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Charger types view (default)
  return (
    <div className="absolute right-0 top-14 z-[1000] h-[calc(100%-3.5rem)] w-full sm:w-[400px] animate-slide-in-right">
      <Card className="h-full rounded-none border-l shadow-xl overflow-auto backdrop-blur-xl bg-card/90 dark:bg-card/80 border-l-border/50">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span>{station.name}</span>
              <span className={cn('text-sm font-normal', statusColors[station.status])}>
                {station.availablePoints}/{station.totalPoints} διαθέσιμοι
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-6">
          <div className="text-sm text-muted-foreground">
            📍 {station.address}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-base mb-2">Τύποι Φορτιστών</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Επίλεξε τύπο για να δεις τους φορτιστές
            </p>
            
            {connectorTypes.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Φόρτωση φορτιστών...
              </div>
            ) : (
              <div className="space-y-3">
                {connectorTypes.map((type) => {
                  const typePoints = pointsByType[type] || [];
                  const availableCount = typePoints.filter(p => p.status === 'available').length;
                  const avgPrice = typePoints.length > 0 
                    ? typePoints.reduce((sum, p) => sum + p.kwhprice, 0) / typePoints.length 
                    : 0;
                  const hasFast = typePoints.some(p => p.fast_charger);
                  
                  return (
                    <div 
                      key={type}
                      onClick={() => handleTypeClick(type)}
                      className="p-4 rounded-xl border bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">⚡</span>
                          <div>
                            <div className="font-medium text-base">{type}</div>
                            {hasFast && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-lg dark:bg-yellow-900 dark:text-yellow-200">
                                Ταχεία
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "text-base font-medium",
                            availableCount > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {availableCount}/{typePoints.length}
                          </div>
                         
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
