import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin, Zap, SlidersHorizontal, Info } from 'lucide-react';

interface HelpSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSidebar({ isOpen, onClose }: HelpSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-14 z-[1100] h-[calc(100%-3.5rem)] w-full sm:w-[400px] animate-slide-in-right transition-transform duration-300 ease-out">
      <Card className="h-full rounded-none border-l shadow-xl overflow-auto backdrop-blur-xl bg-card/90 dark:bg-card/80 border-l-border/50">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Βοήθεια
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Κλείσιμο βοήθειας"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Οδηγός Χρήσης</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Για την ευκολότερη χρήση της εφαρμογής και τη γρήγορη αναζήτηση σταθμών φόρτισης.
            </p>
          </div>

          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Κάλυψη</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Η εταιρεία μας δραστηριοποιείται σε όλη την Αττική. Οι σταθμοί φόρτισης με διαθέσιμους φορτιστές απεικονίζονται στον χάρτη με πράσινα εικονίδια.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">Επιλογή Σταθμού</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Πατώντας πάνω σε έναν σταθμό, εμφανίζονται ομαδοποιημένοι οι φορτιστές ανάλογα με το είδος τους.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">Πληροφορίες Φορτιστή</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Τύπος φορτιστή
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Ισχύς
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Κόστος φόρτισης
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Φίλτρα</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Χρησιμοποίησε τα φίλτρα για να βρεις σταθμούς σύμφωνα με τις ανάγκες σου.
                </p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
