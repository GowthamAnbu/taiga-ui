import {Directive} from '@angular/core';

import {AbstractTuiControl} from './control';

@Directive()
export abstract class AbstractTuiMultipleControl<T> extends AbstractTuiControl<
    readonly T[]
> {
    protected clear(): void {
        this.value = [];
    }

    protected getFallbackValue(): readonly T[] {
        return [];
    }
}
