import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IntersectionObserverModule} from '@ng-web-apis/intersection-observer';
import {TuiAddonDocModule, tuiGenerateRoutes} from '@taiga-ui/addon-doc';
import {TuiActiveZoneModule} from '@taiga-ui/cdk';
import {
    TuiButtonModule,
    TuiLinkModule,
    TuiNotificationModule,
    TuiSvgModule,
} from '@taiga-ui/core';
import {TuiCheckboxLabeledModule} from '@taiga-ui/kit';

import {IconsComponent} from './icons.component';
import {IconsGroupModule} from './icons-group/icons-group.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TuiNotificationModule,
        TuiLinkModule,
        TuiSvgModule,
        TuiButtonModule,
        TuiAddonDocModule,
        IconsGroupModule,
        RouterModule.forChild(tuiGenerateRoutes(IconsComponent)),
        TuiCheckboxLabeledModule,
        TuiActiveZoneModule,
        IntersectionObserverModule,
    ],
    declarations: [IconsComponent],
    exports: [IconsComponent],
})
export class IconsModule {}
