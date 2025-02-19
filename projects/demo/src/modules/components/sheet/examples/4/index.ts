import {Component} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TuiSheetOptions} from '@taiga-ui/addon-mobile';

@Component({
    selector: 'tui-sheet-example-4',
    templateUrl: './index.html',
    styleUrls: ['./index.less'],
    encapsulation,
    changeDetection,
})
export class TuiSheetExample4 {
    protected open = false;

    protected elastic = 1;

    protected readonly options: Partial<TuiSheetOptions> = {
        stops: ['12rem'],
    };

    protected get transform(): string {
        return `scale(${this.elastic * this.elastic})`;
    }

    protected toggle(): void {
        this.elastic = 1;
        this.open = !this.open;
    }

    protected onElastic(elastic: number): void {
        this.elastic = elastic;
    }
}
