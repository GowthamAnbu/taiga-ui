import {Attribute, Directive, inject, INJECTOR} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {TUI_FOCUSABLE_ITEM_ACCESSOR} from '@taiga-ui/cdk';

import {tuiCreateUnfinishedValidator} from './unfinished.validator';

@Directive({
    selector: '[tuiUnfinishedValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: TuiUnfinishedValidatorDirective,
            multi: true,
        },
    ],
})
export class TuiUnfinishedValidatorDirective implements Validator {
    private readonly injector = inject(INJECTOR);

    public readonly validate = tuiCreateUnfinishedValidator(
        () => this.injector.get(TUI_FOCUSABLE_ITEM_ACCESSOR),
        this.message || '',
    );

    constructor(
        // eslint-disable-next-line @angular-eslint/no-attribute-decorator
        @Attribute('tuiUnfinishedValidator')
        private readonly message: string | null,
    ) {}
}
