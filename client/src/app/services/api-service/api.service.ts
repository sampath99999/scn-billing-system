import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router, private spinner: NgxSpinnerService) {
	}

	public getHeaders() {
		let token = localStorage.getItem("token") || '';
		return new HttpHeaders({
			'Authorization': `Bearer ${token}`,
			'Access-Control-Allow-Headers': 'origin, x-requested-with'
		})
	}

	public get(endpoint: string, data = {}) {
		return new Promise((resolve, reject) => {
			this.http.get(environment.apiUrl + endpoint, { params: data, headers: this.getHeaders() }).subscribe((res) => {
				resolve(res);
			},
				(error) => {
					if (error.status == 401) {
						this.handleApiError(error);
					} else {
						reject(error);
					}
				}
			);
		});
	}

	public post(endpoint: string, data = {}) {
		return new Promise((resolve, reject) => {
			this.http.post(environment.apiUrl + endpoint, data, { headers: this.getHeaders() }).subscribe((res) => {
				resolve(res);
			},
				(error) => {
					if (error.status == 401) {
						this.handleApiError(error);
					} else {
						reject(error);
					}
				}
			);
		});
	}

	public put(endpoint: string, data = {}) {
		return new Promise((resolve, reject) => {
			this.http.put(environment.apiUrl + endpoint, data, { headers: this.getHeaders() }).subscribe((res) => {
				resolve(res);
			},
				(error) => {
					if (error.status == 401) {
						this.handleApiError(error);
					} else {
						reject(error);
					}
				}
			);
		});
	}

	public delete(endpoint: string, data = {}) {
		return new Promise((resolve, reject) => {
			this.http.delete(environment.apiUrl + endpoint, { params: data, headers: this.getHeaders() }).subscribe((res) => {
				resolve(res);
			},
				(error) => {
					if (error.status == 401) {
						this.handleApiError(error);
					} else {
						reject(error);
					}
				}
			);
		});
	}

	public handleApiError(error: HttpErrorResponse) {
		if (error.status == 401) {
			localStorage.removeItem('token');
			this.router.navigate(['/']);
		}
		this.spinner.hide();
		return error;
	}
}
