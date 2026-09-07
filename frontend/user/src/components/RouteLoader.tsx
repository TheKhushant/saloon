const RouteLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading</span>
    </div>
  </div>
);

export default RouteLoader;
