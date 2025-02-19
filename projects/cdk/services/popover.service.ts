import {inject, Injectable, Provider, ProviderToken, Type} from '@angular/core';
import {TuiContext} from '@taiga-ui/cdk/interfaces';
import {PolymorpheusComponent, PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {BehaviorSubject, Observable, Observer} from 'rxjs';

import {TuiIdService} from './id.service';

export interface TuiPopoverContext<O> extends TuiContext<Observer<O>> {
    readonly component: PolymorpheusComponent<any>;
    readonly createdAt: number;
    readonly id: string;
    readonly completeWith: (value: O) => void;
}

export type TuiPopover<T, O> = T &
    TuiPopoverContext<O> & {
        content: PolymorpheusContent<T & TuiPopoverContext<O>>;
    };

@Injectable()
export abstract class TuiPopoverService<T, K = void> {
    private readonly component: PolymorpheusComponent<any>;
    private readonly items$: BehaviorSubject<ReadonlyArray<TuiPopover<T, any>>>;
    private readonly id = inject(TuiIdService);

    constructor(
        items: ProviderToken<BehaviorSubject<ReadonlyArray<TuiPopover<T, any>>>>,
        component: Type<any>,
        protected readonly options: T = {} as T,
    ) {
        this.component = new PolymorpheusComponent(component);
        this.items$ = inject(items);
    }

    public open<G = void>(
        content: PolymorpheusContent<T & TuiPopoverContext<K extends void ? G : K>>,
        options: Partial<T> = {},
    ): Observable<K extends void ? G : K> {
        return new Observable(observer => {
            const item = {
                ...this.options,
                ...options,
                content,
                $implicit: observer,
                component: this.component,
                createdAt: Date.now(),
                id: this.id.generate(),
                completeWith: (result: K extends void ? G : K): void => {
                    observer.next(result);
                    observer.complete();
                },
            };

            this.items$.next([...this.items$.value, item]);

            return () => {
                this.items$.next(this.items$.value.filter(value => value !== item));
            };
        });
    }
}

export function tuiAsPopover(useExisting: Type<TuiPopoverService<any>>): Provider {
    return {
        provide: TuiPopoverService,
        useExisting,
    };
}
