import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FormLabel, FormService} from '../../services/form-service/form.service';
import {NgClass} from '@angular/common';
import {AuthService} from '../../services/auth-service/auth.service';
import {toast} from 'ngx-sonner';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
	imports: [
		ReactiveFormsModule,
		NgClass,
		RouterLink
	],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
	protected formService: FormService = inject(FormService);
	protected authService: any = inject(AuthService);

	protected loginForm: FormGroup = new FormGroup({
		username: new FormControl<string>(''),
		password: new FormControl<string>(''),
	});
	protected loginFormLabels: FormLabel[] = [
		{label: 'Username', control: 'username'},
		{label: 'Password', control: 'password'},
	];

	protected passwordVisible: boolean = false;
	protected showLoading: boolean = false;

	constructor() {
		if(localStorage.getItem('token')) {
			window.location.href = '/dashboard';
		}
	}

	ngOnInit() {
		this.formService.setFormGroup(this.loginForm, this.loginFormLabels);
	}

	togglePasswordVisibility(element: HTMLInputElement) {
		this.passwordVisible = !this.passwordVisible;
		if (this.passwordVisible) {
			element.setAttribute('type', 'text');
		} else {
			element.setAttribute('type', 'password');
		}
	}

	login() {
		if(this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			return;
		}
		this.showLoading = true;
		this.authService.login(this.loginForm.value.username, this.loginForm.value.password).then((res: any) => {
			if (res) {
				toast('Login successful', {
					description: 'You will be redirected to the dashboard',
				});
				window.location.href = '/dashboard';
			} else {
				toast('Login failed');
			}
		}).catch((error: any) => {
			console.log(error);
			toast.error('Login Failed!', {
				description: error?.error?.message ?? 'Something went wrong'
			});
		}).finally(() => {
			this.showLoading = false;
		});
	}
}
