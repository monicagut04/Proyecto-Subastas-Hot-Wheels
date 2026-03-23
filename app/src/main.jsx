import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Layout y Home
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'

// Módulo de Usuarios
import { ListUsers } from './components/User/ListUsers'
import { DetailUser } from './components/User/DetailUser'

// Módulo de Autos (INCLUYE EL NUEVO FORMULARIO)
import { ListAutos } from './components/Auto/ListAutos'
import { DetailAuto } from './components/Auto/DetailAuto'
import { AutoForm } from './components/Auto/AutoForm' // Asegúrate de que el nombre coincida

// Módulo de Subastas
import { ListSubastas } from './components/Subasta/ListSubastas'
import { DetailSubasta } from './components/Subasta/DetailSubasta'
import { UpdateSubasta } from './components/Subasta/UpdateSubasta'
import { CreateSubasta } from './components/Subasta/CreateSubasta'


const rutas = createBrowserRouter([
  {
    path: "/", 
    element: <Layout/>,
    children: [
      { index: true, element: <Home /> },
      
      // Rutas de Usuarios (Mantenimiento Administrativo)
      { path: "user", element: <ListUsers /> },
      { path: "user/detail/:id", element: <DetailUser /> },

      // Rutas de Autos (Mantenimiento de Objetos)
      { path: "auto", element: <ListAutos /> },
      { path: "auto/detail/:id", element: <DetailAuto /> },
      { path: "auto/create", element: <AutoForm /> }, // Ruta para crear
      { path: "auto/update/:id", element: <AutoForm /> }, // Ruta para editar

      // Rutas de Subastas
      { path: "subasta", element: <ListSubastas /> },
      { path: "subasta/detail/:id", element: <DetailSubasta /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)