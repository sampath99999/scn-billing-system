import {Injectable} from '@angular/core';
import {ApiService} from '../api-service/api.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../types/User';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public authDetails: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

	constructor(protected api: ApiService) {
	}

	public login(username: string, password: string) {
		return new Promise((resolve, reject) => {
			this.api.post('/auth/login', {username, password}).then((res: any) => {
				localStorage.setItem('token', res.data.token);
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		});
	}
}
