import { StationFilters, ConnectorType } from '@/types/station';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, RotateCcw } from 'lucide-react';

const CONNECTOR_TYPES: ConnectorType[] = [
  'CCS2',
  'CHAdeMO',
  'Type2',
  'Caravan Mains Socket',
  'CCS1',
  'J-1772',
  'Three Phase EU',
  'Type 2',
  'Type 3',
  'Type 3A',
  'Wall (Euro)',
];

const DEFAULT_FILTERS: StationFilters = {
  availability: null,
  connectorType: null,
  fastCharging: null,
  priceRange: [0, 1],
  powerRange: [2, 350],
};

interface FilterSidebarProps {
  filters: StationFilters;
  onFiltersChange: (filters: StationFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({ filters, onFiltersChange, isOpen, onClose }: FilterSidebarProps) {
  const handleAvailabilityChange = (checked: boolean) => {
    onFiltersChange({ ...filters, availability: checked ? true : null });
  };

  const handleConnectorChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      connectorType: value === 'all' ? null : value as ConnectorType 
    });
  };

  const handleFastChargingChange = (checked: boolean) => {
    onFiltersChange({ ...filters, fastCharging: checked ? true : null });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [0, value[0]] });
  };

  const handlePowerRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, powerRange: [value[0], value[1]] });
  };

  const handleReset = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-14 z-[1000] h-[calc(100%-3.5rem)] w-full sm:w-[400px] animate-slide-in-right transition-transform duration-300 ease-out">
      <Card className="h-full rounded-none border-l shadow-xl overflow-auto backdrop-blur-xl bg-card/90 dark:bg-card/80 border-l-border/50">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            Φίλτρα
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Επαναφορά
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-6">
          {/* Availability filter */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="availability" className="text-base font-medium">
                Μόνο διαθέσιμοι
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Εμφάνιση σταθμών με διαθέσιμους φορτιστές
              </p>
            </div>
            <Switch
              id="availability"
              checked={filters.availability === true}
              onCheckedChange={handleAvailabilityChange}
            />
          </div>

          {/* Connector type filter */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Τύπος φορτιστή</Label>
            <Select 
              value={filters.connectorType || 'all'} 
              onValueChange={handleConnectorChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Όλοι οι τύποι" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                {CONNECTOR_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fast charging toggle */}
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="fast-charging" className="text-base font-medium">
              Ταχεία φόρτιση
            </Label>
            <Switch
              id="fast-charging"
              checked={filters.fastCharging === true}
              onCheckedChange={handleFastChargingChange}
            />
          </div>

          {/* Price range slider */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                Εύρος τιμής (€/kWh)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Εμφάνιση σταθμών έως την επιλεγμένη τιμή
              </p>
            </div>
            <Slider
              value={[filters.priceRange[1]]}
              onValueChange={handlePriceRangeChange}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">0.00€</span>
              <span className="font-semibold text-primary">{filters.priceRange[1].toFixed(2)}€</span>
            </div>
          </div>

          {/* Power range slider */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                Ισχύς φόρτισης (kW)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Επιλέξτε εύρος ισχύος
              </p>
            </div>
            <Slider
              value={[filters.powerRange[0], filters.powerRange[1]]}
              onValueChange={handlePowerRangeChange}
              min={2}
              max={350}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-primary">{filters.powerRange[0]} kW</span>
              <span className="font-semibold text-primary">{filters.powerRange[1]} kW</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
