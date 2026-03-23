import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'



// NUEVAS IMPORTACIONES: Módulo de Usuarios y Autos
import { ListUsers } from './components/User/ListUsers'
import { DetailUser } from './components/User/DetailUser'
import { ListAutos } from './components/Auto/ListAutos'
import { DetailAuto } from './components/Auto/DetailAuto'
import { ListSubastas } from './components/Subasta/ListSubastas'
import { DetailSubasta } from './components/Subasta/DetailSubasta'
import { UpdateSubasta } from './components/Subasta/UpdateSubasta'
import { CreateSubasta } from './components/Subasta/CreateSubasta'


const rutas = createBrowserRouter([
  {
    path: "/", // ¡ESTA LÍNEA ES LA CLAVE! Define la raíz de la aplicación
    element: <Layout/>,
    children: [
      { index: true, element: <Home /> },
      
      // Rutas de Usuarios
      { path: "user", element: <ListUsers /> },
      { path: "user/detail/:id", element: <DetailUser /> },

      // Rutas de Autos
      { path: "auto", element: <ListAutos /> },
      { path: "auto/detail/:id", element: <DetailAuto /> },

      // El comodín de Error 404 SIEMPRE debe ir al final de la lista
      { path: "*", element: <PageNotFound /> },
      // Rutas de Subastas
      { path: "subasta", element: <ListSubastas /> },
      { path: "subasta/detail/:id", element: <DetailSubasta /> },
      { path: "subasta/create", element: <CreateSubasta /> }, // (Aprovechamos para asegurar que tienes esta de crear)
      { path: "subasta/update/:id", element: <UpdateSubasta /> }, // 🌟 LA NUEVA RUTA DE EDICIÓN 🌟
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)