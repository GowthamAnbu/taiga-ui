import {Component, ViewChild} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TuiValidationError} from '@taiga-ui/cdk';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';

@Component({
    selector: 'tui-field-error-pipe-example-4',
    templateUrl: './index.html',
    styleUrls: ['./index.less'],
    encapsulation,
    changeDetection,
})
export class TuiFieldErrorPipeExample4 {
    @ViewChild('phoneErrorContent')
    protected phoneErrorContent: PolymorpheusContent;

    protected testForm = new FormGroup({
        phones: new FormArray(
            [new FormControl('', [Validators.required, this.getPhoneLengthValidator()])],
            [this.getPhoneArrayValidator()],
        ),
    });

    protected get formData(): FormArray {
        return this.testForm.get('phones') as FormArray;
    }

    protected addPhone(): void {
        this.formData.push(new FormControl('', this.addValidators()));
    }

    protected removePhone(index: number): void {
        this.formData.removeAt(index);

        let n = 0;

        while (n <= 1 && this.formData.controls[n]) {
            this.formData.controls[n].setValidators([
                Validators.required,
                this.getPhoneLengthValidator(),
            ]);
            n++;
        }
    }

    protected addValidators(): ValidationErrors | null {
        return this.formData.controls.length < 2
            ? [Validators.required, this.getPhoneLengthValidator()]
            : null;
    }

    private getPhoneLengthValidator(): (
        field: AbstractControl,
    ) => ValidationErrors | null {
        return (field: AbstractControl): ValidationErrors | null =>
            field.value.length !== 12
                ? {
                      length: new TuiValidationError(this.phoneErrorContent),
                  }
                : null;
    }

    private getPhoneArrayValidator(): ValidatorFn {
        return ((array: FormArray): ValidationErrors | null =>
            array.controls.length < 2 ||
            (!!array.controls.filter(item => item.errors).length && array.controls.length)
                ? {
                      length: new TuiValidationError(
                          'You should add at least 2 phone number',
                      ),
                  }
                : null) as ValidatorFn;
    }
}
