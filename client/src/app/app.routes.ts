import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PackagesComponent } from './pages/dashboard/packages/packages.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login',
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		children: [
			{
				path: 'invoices',
				component: DashboardComponent,
			},
			{
				path: 'customers',
				component: DashboardComponent,
			},
			{
				path: 'packages',
				component: PackagesComponent,
			},
			{
				path: 'reports',
				component: DashboardComponent,
			},
			{
				path: 'payments',
				component: DashboardComponent,
			},
			{
				path: 'settings',
				component: DashboardComponent,
			},
		],
	},
	{
		path: '**',
		redirectTo: 'dashboard',
	},
];
