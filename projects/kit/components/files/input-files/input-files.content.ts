import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiContext, tuiPure} from '@taiga-ui/cdk';
import {TuiBreakpointService, TuiLinkModule} from '@taiga-ui/core';
import {TUI_INPUT_FILE_TEXTS} from '@taiga-ui/kit/tokens';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {combineLatest, map, Observable, of} from 'rxjs';

import {TuiInputFilesComponent} from './input-files.component';

@Component({
    standalone: true,
    imports: [AsyncPipe, TuiLinkModule],
    template: `
        <a tuiLink>{{ link$ | async }}</a>
        {{ label$ | async }}
    `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TuiInputFilesContent {
    private readonly breakpoint$ = inject(TuiBreakpointService);
    private readonly text$ = inject(TUI_INPUT_FILE_TEXTS);
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiContext<boolean>;
    private readonly component = inject(TuiInputFilesComponent);

    protected get link$(): Observable<string> {
        return this.computeLink$(
            this.context.$implicit,
            !!this.component.input?.input.multiple,
        );
    }

    protected get label$(): Observable<string> {
        return this.computeLabel$(
            this.context.$implicit,
            !!this.component.input?.input.multiple,
        );
    }

    @tuiPure
    private computeLink$(fileDragged: boolean, multiple: boolean): Observable<string> {
        return fileDragged
            ? of('')
            : this.text$.pipe(
                  map(t => (multiple ? t.defaultLinkMultiple : t.defaultLinkSingle)),
              );
    }

    @tuiPure
    private computeLabel$(fileDragged: boolean, multiple: boolean): Observable<string> {
        return fileDragged
            ? combineLatest([this.breakpoint$, this.text$]).pipe(
                  map(([breakpoint, text]) => {
                      if (breakpoint === 'mobile') {
                          return '';
                      }

                      return multiple ? text.dropMultiple : text.drop;
                  }),
              )
            : combineLatest([this.breakpoint$, this.text$]).pipe(
                  map(([breakpoint, text]) => {
                      if (breakpoint === 'mobile') {
                          return '';
                      }

                      return multiple
                          ? text.defaultLabelMultiple
                          : text.defaultLabelSingle;
                  }),
              );
    }
}
