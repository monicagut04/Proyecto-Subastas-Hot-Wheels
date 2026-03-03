import Header from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    // bg-black asegura que si el contenido es corto, no se vea una franja blanca abajo
    <div className="flex min-h-screen flex-col bg-black selection:bg-red-600 selection:text-white">
      
      {/* Barra de navegación superior */}
      <Header />
      
      {/* pt-20: Ajustado para que el contenido empiece después de nuestro nuevo Header (h-20)
          pb-20: Espacio elegante antes de llegar al Footer
          flex-1: Empuja el footer hacia abajo si hay poco contenido
      */}
      <main className="flex-1 pt-24 pb-20 animate-in fade-in duration-700">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Pie de página */}
      <Footer />
      
    </div>
  );
}