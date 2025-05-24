import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'invoices',
		component: DashboardComponent // Replace with InvoicesComponent when created
	},
	{
		path: 'customers',
		component: DashboardComponent // Replace with CustomersComponent when created
	},
	{
		path: 'products',
		component: DashboardComponent // Replace with ProductsComponent when created
	},
	{
		path: 'reports',
		component: DashboardComponent // Replace with ReportsComponent when created
	},
	{
		path: 'payments',
		component: DashboardComponent // Replace with PaymentsComponent when created
	},
	{
		path: 'settings',
		component: DashboardComponent // Replace with SettingsComponent when created
	},
	{
		path: '**',
		redirectTo: 'dashboard'
	}
];
