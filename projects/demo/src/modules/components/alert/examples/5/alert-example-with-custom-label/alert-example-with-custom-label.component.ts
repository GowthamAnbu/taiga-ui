import {Component, inject} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {TuiPopover} from '@taiga-ui/cdk';
import {TuiAlertOptions} from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';

@Component({
    selector: 'tui-notifications-service-example-with-custom-label',
    templateUrl: './alert-example-with-custom-label.template.html',
    changeDetection,
})
export class AlertExampleWithCustomLabelComponent {
    protected readonly context =
        inject<TuiPopover<TuiAlertOptions<unknown>, boolean>>(POLYMORPHEUS_CONTEXT);
}
