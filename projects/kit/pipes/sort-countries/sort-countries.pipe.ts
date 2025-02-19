import {inject, Pipe, PipeTransform} from '@angular/core';
import {TuiCountryIsoCode} from '@taiga-ui/i18n';
import {TUI_COUNTRIES} from '@taiga-ui/kit/tokens';
import {map, Observable} from 'rxjs';

@Pipe({
    name: 'tuiSortCountries',
})
export class TuiSortCountriesPipe implements PipeTransform {
    private readonly countriesNames$ = inject(TUI_COUNTRIES);

    public transform(
        countries: readonly TuiCountryIsoCode[],
    ): Observable<TuiCountryIsoCode[]> {
        return this.countriesNames$.pipe(
            map(names => [...countries].sort((a, b) => names[a].localeCompare(names[b]))),
        );
    }
}
