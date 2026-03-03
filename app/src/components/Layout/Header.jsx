import { Link, useLocation } from "react-router-dom";
import { Car, Users, Gavel, Home } from "lucide-react";

export default function Header() {
  const location = useLocation();

  // Función auxiliar para saber si una ruta está activa y pintarla de otro color
  const isActive = (path) => location.pathname.includes(path) ? "text-primary font-bold" : "text-muted-foreground hover:text-primary";

  return (
    <header className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo / Nombre del Sistema */}
        <div className="flex items-center gap-2">
          <Gavel className="h-6 w-6 text-primary" />
          <span className="text-xl font-extrabold tracking-tight">
            HotWheels <span className="text-primary">Auction</span>
          </span>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={`flex items-center gap-2 transition-colors ${location.pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'}`}>
            <Home className="h-4 w-4" /> Inicio
          </Link>
          <Link to="/user" className={`flex items-center gap-2 transition-colors ${isActive('/user')}`}>
            <Users className="h-4 w-4" /> Usuarios
          </Link>
          <Link to="/auto" className={`flex items-center gap-2 transition-colors ${isActive('/auto')}`}>
            <Car className="h-4 w-4" /> Autos
          </Link>
          {/* Este botón lo usaremos en el siguiente paso */}
          <Link to="/subasta" className={`flex items-center gap-2 transition-colors ${isActive('/subasta')}`}>
            <Gavel className="h-4 w-4" /> Subastas
          </Link>
        </nav>

      </div>
    </header>
  );
}