import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import LoginPage from './pages/login.page';
import DashboardPage from './pages/dashboard/dashboard';
import PackagesPage from './pages/dashboard/packages/page';

const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage
  },
  {
    path: '/dashboard',
    Component: DashboardPage,
    children: [
      {
        path: 'master-data',
        children: [
          {
            path: 'packages',
            Component: PackagesPage
          },
          // {
          //   path: 'streets',
          //   Component: StreetsPage
          // },
          // {
          //   path: 'accessories',
          //   Component: AccessoriesPage
          // },
          // {
          //   path: 'users',
          //   Component: UsersPage
          // }
        ]
      }
    ]
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <RouterProvider router={router} />
  </StrictMode>,
)
