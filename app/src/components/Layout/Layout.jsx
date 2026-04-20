import Header from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";


import { AuthProvider } from "../../context/AuthProvider";
import { Toaster } from "react-hot-toast";

export function Layout() {
  return (

    <AuthProvider>
        <div className="flex min-h-screen flex-col bg-black selection:bg-red-600 selection:text-white">
          
          {/* Barra de navegación superior */}
          <Header />
          
          <main className="flex-1 pt-24 pb-20 animate-in fade-in duration-700">
            <div className="container mx-auto">
       
              <Outlet />
            </div>
          </main>

          {/* Pie de página */}
          <Footer />
          
      
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: '#18181b', // zinc-900
                color: '#fff',
                border: '1px solid #3f3f46', // zinc-700
                fontSize: '14px',
                fontWeight: 'bold',
              }
            }} 
          />
        </div>
    </AuthProvider>
  );
}