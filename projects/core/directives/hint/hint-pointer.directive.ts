import {Directive, HostListener} from '@angular/core';
import {EMPTY_CLIENT_RECT, tuiPointToClientRect} from '@taiga-ui/cdk';
import {tuiAsDriver, tuiAsRectAccessor, TuiRectAccessor} from '@taiga-ui/core/abstract';

import {TuiHintHoverDirective} from './hint-hover.directive';

@Directive({
    selector: '[tuiHint][tuiHintPointer]',
    providers: [
        tuiAsRectAccessor(TuiHintPointerDirective),
        tuiAsDriver(TuiHintPointerDirective),
    ],
})
export class TuiHintPointerDirective
    extends TuiHintHoverDirective
    implements TuiRectAccessor
{
    private currentRect = EMPTY_CLIENT_RECT;

    public getClientRect(): ClientRect {
        return this.currentRect;
    }

    @HostListener('mousemove.silent', ['$event'])
    protected onMove({clientX, clientY}: MouseEvent): void {
        this.currentRect = tuiPointToClientRect(clientX, clientY);
    }
}
