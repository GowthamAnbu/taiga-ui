import {InjectionToken, Optional, Provider, SkipSelf} from '@angular/core';
import {tuiCreateToken} from '@taiga-ui/cdk';
import {TUI_DEFAULT_NUMBER_FORMAT} from '@taiga-ui/core/constants';
import {TuiNumberFormatSettings} from '@taiga-ui/core/interfaces';
import {map, Observable, of} from 'rxjs';

/**
 * Formatting configuration for displayed numbers
 */
export const TUI_NUMBER_FORMAT: InjectionToken<Observable<TuiNumberFormatSettings>> =
    tuiCreateToken(of(TUI_DEFAULT_NUMBER_FORMAT));

export function tuiNumberFormatProvider(
    options: Partial<TuiNumberFormatSettings>,
): Provider {
    return {
        provide: TUI_NUMBER_FORMAT,
        deps: [[new Optional(), new SkipSelf(), TUI_NUMBER_FORMAT]],
        useFactory: (
            parent: Observable<TuiNumberFormatSettings> | null,
        ): Observable<TuiNumberFormatSettings> =>
            (parent || of(TUI_DEFAULT_NUMBER_FORMAT)).pipe(
                map(format => ({...format, ...options})),
            ),
    };
}
