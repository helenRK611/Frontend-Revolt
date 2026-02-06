import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles, X } from 'lucide-react';
import type { APIPoint } from '@/types/station';

interface SuccessPanelProps {
  email: string;
  point: APIPoint;
  stationAddress: string;
  reservationMinutes: number;
  onClose: () => void;
}

export function SuccessPanel({ email, point, stationAddress, reservationMinutes, onClose }: SuccessPanelProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full sm:w-[500px] max-w-[90vw] shadow-2xl animate-in zoom-in-95 duration-300">
        <CardContent className="p-8 text-center space-y-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-primary" />
              <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">
              ΕΠΙΤΥΧΗΣ ΚΡΑΤΗΣΗ!
            </h2>
          </div>

          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Ο κωδικός ενεργοποίησης κράτησης στάλθηκε στο:
            </p>
            <p className="text-lg font-medium text-foreground break-all">
              {email}
            </p>
          </div>

          <div className="bg-muted rounded-xl p-4 space-y-3 text-left">
  <h3 className="text-sm font-semibold text-primary">
    Στοιχεία Κράτησης
  </h3>

  <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
    <span className="text-muted-foreground">Σταθμός:</span>
    <span className="font-medium">{stationAddress}</span>

    <span className="text-muted-foreground">Point ID:</span>
    <span className="font-mono font-medium">{point.pointid}</span>

    <span className="text-muted-foreground">Διάρκεια κράτησης:</span>
    <span className="font-medium">{reservationMinutes} λεπτά</span>
  </div>
</div>



          <Button onClick={onClose} className="w-full">
            Κλείσιμο 
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
