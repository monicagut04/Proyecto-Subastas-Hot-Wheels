import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, Users, Gavel, Home, Menu, X } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil

  const isActive = (path) => {
    const active = path === '/' ? location.pathname === '/' : location.pathname.includes(path);
    const baseClasses = "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 text-[11px] uppercase font-black tracking-[0.2em]";
    
    return active 
      ? `${baseClasses} text-white bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]` 
      : `${baseClasses} text-zinc-400 hover:text-white hover:bg-zinc-800/50`;
  };

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#000000]">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        
        {/* Contenedor del Logo */}
        <Link to="/" className="flex items-center group">
          <div className="relative h-20 w-44 flex items-center justify-center bg-[#000000]">
            <img 
              src="/img/logo.jpg" 
              alt="Hot Wheels Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Menú de Navegación - ESCRITORIO (md:flex) */}
        <nav className="hidden md:flex items-center gap-2 bg-zinc-900/40 p-1.5 rounded-2xl border border-white/5">
          <Link to="/" className={isActive('/')}>
            <Home className="h-4 w-4" /> Inicio
          </Link>
          <Link to="/user" className={isActive('/user')}>
            <Users className="h-4 w-4" /> Usuarios
          </Link>
          <Link to="/auto" className={isActive('/auto')}>
            <Car className="h-4 w-4" /> Autos
          </Link>
          <Link to="/subasta" className={isActive('/subasta')}>
            <Gavel className="h-4 w-4" /> Subastas
          </Link>
        </nav>

        {/* Lado Derecho: Status (Oculto en móvil) */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                Live <span className="text-red-600">Stats</span>
            </span>
        </div>

        {/* BOTÓN HAMBURGUESA - MÓVIL (Visible solo en md:hidden) */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-8 w-8 text-red-600" /> : <Menu className="h-8 w-8" />}
        </button>

      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      <div className={`
        absolute top-24 left-0 w-full bg-[#000000] border-b border-white/10 transition-all duration-300 md:hidden
        ${isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-10 invisible"}
      `}>
        <nav className="flex flex-col gap-2 p-6 bg-zinc-900/20 backdrop-blur-xl">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className={isActive('/')}>
            <Home className="h-4 w-4" /> Inicio
          </Link>
          <Link to="/user" onClick={() => setIsMenuOpen(false)} className={isActive('/user')}>
            <Users className="h-4 w-4" /> Usuarios
          </Link>
          <Link to="/auto" onClick={() => setIsMenuOpen(false)} className={isActive('/auto')}>
            <Car className="h-4 w-4" /> Autos
          </Link>
          <Link to="/subasta" onClick={() => setIsMenuOpen(false)} className={isActive('/subasta')}>
            <Gavel className="h-4 w-4" /> Subastas
          </Link>
          
          {/* Status Live para Móvil dentro del menú */}
          <div className="mt-4 flex items-center justify-center gap-3 p-4 border border-zinc-800 rounded-xl">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Live Stats</span>
          </div>
        </nav>
      </div>
    </header>
  );
}