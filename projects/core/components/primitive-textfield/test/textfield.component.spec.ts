import {Component, ElementRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TUI_TEXTFIELD_HOST} from '@taiga-ui/core/tokens';

import {TuiPrimitiveTextfieldModule} from '../primitive-textfield.module';

describe('Textfield', () => {
    @Component({
        template: `
            <input
                #auto
                tuiTextfield
            />
            <input
                #attr
                id="attr"
                tuiTextfield
            />
            <input
                #bind
                tuiTextfield
                [id]="value"
            />
        `,
    })
    class TestComponent {
        @ViewChild('auto', {read: ElementRef})
        public readonly auto!: ElementRef<HTMLElement>;

        @ViewChild('attr', {read: ElementRef})
        public readonly attr!: ElementRef<HTMLElement>;

        @ViewChild('bind', {read: ElementRef})
        public readonly bind!: ElementRef<HTMLElement>;

        public value = 'bind';
    }

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [TuiPrimitiveTextfieldModule],
            declarations: [TestComponent],
            providers: [
                {
                    provide: TUI_TEXTFIELD_HOST,
                    useValue: {
                        process: () => {},
                    },
                },
            ],
        });
        await TestBed.compileComponents();
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('id binding', () => {
        it('Auto id generation works', () => {
            expect(testComponent.auto.nativeElement.id).toBeTruthy();
        });

        it('Static id is not overridden', () => {
            expect(testComponent.attr.nativeElement.id).toBe('attr');
        });

        it('Dynamic id binding works', () => {
            expect(testComponent.bind.nativeElement.id).toBe('bind');
        });
    });
});
