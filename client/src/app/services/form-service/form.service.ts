import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

export interface FormLabel {
	label: string;
	control: string;
}

@Injectable({
	providedIn: 'root'
})
export class FormService {
	protected formGroup: FormGroup = new FormGroup({});
	protected formGroupLabels: FormLabel[] = [];
	constructor() {
	}

	public setFormGroup(formGroup: FormGroup, formGroupLabels: FormLabel[]) {
		this.formGroup = formGroup;
		this.formGroupLabels = formGroupLabels;
	}

	public isFieldInvalid(field: string): boolean {
		return (this.formGroup.get(field)?.invalid && (this.formGroup.get(field)?.touched || this.formGroup.get(field)?.dirty)) ?? false;
	}

	getFieldLabel(field: string): string {
		const label = this.formGroupLabels.find((label) => label.control === field)?.label;
		return label ? label : field;
	}

	public getFieldErrorMessage(field: string): string {
		const label = this.getFieldLabel(field);
		if (this.formGroup.get(field)?.hasError('required')) {
			return `${label} is required`;
		} else if (this.formGroup.get(field)?.hasError('minlength')) {
			return `${label} must be at least ${this.formGroup.get(field)?.errors?.['minlength'].requiredLength} characters long`;
		} else if (this.formGroup.get(field)?.hasError('maxlength')) {
			return `${label} must be at most ${this.formGroup.get(field)?.errors?.['maxlength'].requiredLength} characters long`;
		} else if (this.formGroup.get(field)?.hasError('min')) {
			return `${label} must be at least ${this.formGroup.get(field)?.errors?.['min'].min}`;
		} else if (this.formGroup.get(field)?.hasError('max')) {
			return `${label} must be at most ${this.formGroup.get(field)?.errors?.['max'].max}`;
		}
		return '';
	}
}
