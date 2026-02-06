import revoltLogo from '@/assets/revolt-logo.png';

export function TopBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-[900] h-14 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center px-4 shadow-sm">
      <div className="flex items-center gap-0">
        {/* Revolt logo image */}
        <img src={revoltLogo} alt="Revolt logo" className="h-16 w-16 object-contain" />
          <span className="text-2xl font-bold">
          <span className="text-muted-foreground">r</span>
          <span className="text-primary font-extrabold">EV</span>
          <span className="text-muted-foreground">olt</span>
        
        </span>
      </div>
    </div>
  );
}
