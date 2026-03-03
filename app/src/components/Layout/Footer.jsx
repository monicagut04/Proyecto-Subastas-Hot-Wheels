export function Footer() {
  return (
    <footer className="w-full bg-black/80 backdrop-blur-md border-t border-zinc-800/50 flex items-center justify-center px-4 py-6 mt-12">
      <div className="w-full max-w-7xl flex flex-col items-center gap-1">
        {/* Línea decorativa estilo Hot Wheels */}
        <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full mb-2" />
        
        <p className="text-sm font-black uppercase tracking-[0.3em] text-zinc-100">
            SUBASTAS <span className="text-red-600 italic">Project</span>
        </p>
        
        <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-zinc-800" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                © {new Date().getFullYear()} Elite Auction Engine
            </p>
            <div className="h-px w-8 bg-zinc-800" />
        </div>
      </div>
    </footer>
  );
}