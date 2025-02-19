import {Component, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {
    TuiRootModule,
    TuiSizeL,
    TuiSizeS,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
    TuiInputTagComponent,
    TuiInputTagModule,
    tuiInputTagOptionsProvider,
} from '@taiga-ui/kit';

describe('InputTag [TUI_TAG_STATUS=neutral]', () => {
    @Component({
        template: `
            <tui-root>
                <tui-input-tag
                    [ngModel]="tags"
                    [tuiTextfieldLabelOutside]="labelOutside"
                    [tuiTextfieldSize]="size"
                ></tui-input-tag>
            </tui-root>
        `,
        providers: [tuiInputTagOptionsProvider({tagStatus: 'neutral'})],
    })
    class TestComponent {
        @ViewChild(TuiInputTagComponent)
        public component!: TuiInputTagComponent;

        public tags = ['Tag1', 'Tag2'];

        public labelOutside = true;
        public size: TuiSizeL | TuiSizeS = 's';
    }

    let fixture: ComponentFixture<TestComponent>;

    it('correct status for tag when tuiMode emitted null', async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                TuiRootModule,
                TuiInputTagModule,
                TuiTextfieldControllerModule,
            ],
            declarations: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();

        expect(
            fixture.nativeElement
                .querySelector('[data-status]')
                ?.getAttribute('data-status'),
        ).toBe('neutral');
    });
});
