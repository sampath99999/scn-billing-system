import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import LoginPage from './pages/login.page';

const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <RouterProvider router={router} />
  </StrictMode>,
)
