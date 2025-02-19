/// <reference types="@taiga-ui/tsconfig/ng-dev-mode" />
import {
    ChangeDetectorRef,
    Directive,
    HostBinding,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Provider,
    Type,
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NgControl, NgModel} from '@angular/forms';
import {tuiAssert} from '@taiga-ui/cdk/classes';
import {EMPTY_FUNCTION} from '@taiga-ui/cdk/constants';
import {TuiControlValueTransformer} from '@taiga-ui/cdk/interfaces';
import {tuiIsPresent} from '@taiga-ui/cdk/utils';
import {
    delay,
    distinctUntilChanged,
    filter,
    map,
    merge,
    startWith,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';

import {AbstractTuiInteractive} from './interactive';
import {AbstractTuiValueTransformer} from './value-transformer';

/**
 * Basic ControlValueAccessor class to build form components upon
 */
@Directive()
export abstract class AbstractTuiControl<T>
    extends AbstractTuiInteractive
    implements OnDestroy, OnInit, ControlValueAccessor
{
    private readonly ngControl = inject(NgControl, {optional: true});
    private previousInternalValue?: T | null;
    private readonly refresh$ = new Subject<void>();

    @Input()
    @HostBinding('class._readonly')
    public readOnly = false;

    @Input()
    public pseudoInvalid: boolean | null = null;

    protected onTouched = EMPTY_FUNCTION;
    protected onChange = EMPTY_FUNCTION;
    protected readonly fallbackValue = this.getFallbackValue();
    protected readonly destroy$ = new Subject<void>();
    protected readonly cdr = inject(ChangeDetectorRef);
    protected readonly valueTransformer = inject<TuiControlValueTransformer<T>>(
        AbstractTuiValueTransformer,
        {optional: true},
    );

    constructor() {
        super();

        if (ngDevMode && this.ngControl === null) {
            tuiAssert.assert(
                false,
                `NgControl not injected in ${this.constructor.name}!\n`,
                'Use [(ngModel)] or [formControl] or formControlName for correct work.',
            );
        }

        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    protected abstract getFallbackValue(): T;

    @HostBinding('class._invalid')
    public get computedInvalid(): boolean {
        return (
            this.interactive &&
            (this.pseudoInvalid !== null
                ? this.pseudoInvalid
                : this.touched && this.invalid)
        );
    }

    public get value(): T {
        return this.previousInternalValue ?? this.fallbackValue;
    }

    public set value(value: T) {
        this.updateValue(value);
    }

    public get safeCurrentValue(): T {
        return this.rawValue ?? this.fallbackValue;
    }

    public get invalid(): boolean {
        return this.safeNgControlData<boolean>(({invalid}) => invalid, false);
    }

    public get valid(): boolean {
        return this.safeNgControlData<boolean>(({valid}) => valid, false);
    }

    public get touched(): boolean {
        return this.safeNgControlData<boolean>(({touched}) => touched, false);
    }

    public get disabled(): boolean {
        return this.safeNgControlData<boolean>(({disabled}) => disabled, false);
    }

    public get interactive(): boolean {
        return !this.readOnly && !this.computedDisabled;
    }

    public get control(): AbstractControl | null {
        return this.safeNgControlData<AbstractControl | null>(
            ({control}) => control,
            null,
        );
    }

    public get computedName(): string | null {
        return this.controlName?.toString() ?? null;
    }

    public get controlName(): string | null {
        return this.ngControl?.name?.toString() ?? null;
    }

    public ngOnInit(): void {
        this.refresh$
            .pipe(
                delay(0),
                startWith(null),
                map(() => this.ngControl?.control),
                filter(tuiIsPresent),
                distinctUntilChanged(),
                switchMap(control => merge(control.valueChanges, control.statusChanges)),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.refreshLocalValue(this.safeCurrentValue);
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public checkControlUpdate(): void {
        this.cdr.markForCheck();
    }

    public registerOnChange(onChange: (value: T | unknown) => void): void {
        this.onChange = (componentValue: T) => {
            onChange(this.toControlValue(componentValue));
        };

        this.refresh$.next();
    }

    public registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    public setDisabledState(): void {
        this.checkControlUpdate();
    }

    public writeValue(value: T | null): void {
        const controlValue =
            this.ngControl instanceof NgModel && this.previousInternalValue === undefined
                ? this.ngControl.model
                : value;

        this.refreshLocalValue(this.fromControlValue(controlValue));
    }

    protected override updateFocused(focused: boolean): void {
        if (!focused) {
            this.controlMarkAsTouched();
        }

        super.updateFocused(focused);
    }

    /**
     * @deprecated use `value` setter
     */
    protected updateValue(value: T): void {
        if (this.disabled || this.valueIdenticalComparator(this.value, value)) {
            return;
        }

        this.previousInternalValue = value;
        this.controlSetValue(value);
    }

    protected valueIdenticalComparator(oldValue: T, newValue: T): boolean {
        return oldValue === newValue;
    }

    private get rawValue(): T | undefined {
        const {ngControl} = this;

        if (ngControl === null) {
            return undefined;
        }

        const controlValue =
            ngControl instanceof NgModel && this.previousInternalValue === undefined
                ? ngControl.viewModel
                : ngControl.value;

        return this.fromControlValue(controlValue);
    }

    private safeNgControlData<T>(
        extractor: (ngControl: NgControl) => T | null | undefined,
        defaultFieldValue: T,
    ): T {
        return (this.ngControl && extractor(this.ngControl)) ?? defaultFieldValue;
    }

    private controlMarkAsTouched(): void {
        this.onTouched();
        this.checkControlUpdate();
    }

    private controlSetValue(value: T): void {
        this.onChange(value);
        this.checkControlUpdate();
    }

    private refreshLocalValue(value: T | null): void {
        this.previousInternalValue = value;
        this.checkControlUpdate();
    }

    private fromControlValue(controlValue: unknown): T {
        return this.valueTransformer
            ? this.valueTransformer.fromControlValue(controlValue)
            : (controlValue as T);
    }

    private toControlValue(componentValue: T): unknown {
        return this.valueTransformer
            ? this.valueTransformer.toControlValue(componentValue)
            : componentValue;
    }
}

export function tuiAsControl<T>(useExisting: Type<AbstractTuiControl<T>>): Provider {
    return {
        provide: AbstractTuiControl,
        useExisting,
    };
}
