import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import LoginPage from './pages/login.page';
import DashboardPage from './pages/dashboard/dashboard';

const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage
  },
  {
    path: '/dashboard',
    Component: DashboardPage
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <RouterProvider router={router} />
  </StrictMode>,
)
