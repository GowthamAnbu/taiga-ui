import {DebugElement} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';

import {tuiCreateKeyboardEvent} from './keyboard-event';
import {TuiPageObject} from './page-object';
import {tuiReplaceNbsp} from './replace-nbsp';

export class TuiNativeInputPO {
    private readonly pageObject: TuiPageObject<unknown>;

    constructor(
        private readonly fixture: ComponentFixture<unknown>,
        private readonly automationId: string,
        private readonly hostDebugElement?: DebugElement,
    ) {
        this.pageObject = new TuiPageObject(fixture);
    }

    public get nativeElement(): HTMLInputElement | HTMLTextAreaElement | null {
        return (
            this.pageObject.getByAutomationId(this.automationId, this.hostDebugElement)
                ?.nativeElement ?? null
        );
    }

    public get value(): string {
        return tuiReplaceNbsp(this.nativeElement?.value ?? '');
    }

    public get focused(): boolean {
        return document.activeElement === this.nativeElement;
    }

    public sendText(value: string): void {
        this.focus(); // need focus before initial value for emulate user interaction

        const nativeElement = this.nativeElement;

        if (nativeElement) {
            nativeElement.value = value;
            nativeElement.dispatchEvent(new Event('input', {bubbles: true}));
        }

        this.fixture.detectChanges();
    }

    // @bad TODO: Fix this with actually moving focus rather than just blurring
    public sendTextAndBlur(value: string): void {
        this.focus();
        this.sendText(value);
        this.blur();
    }

    public sendKeydown(key: string): void {
        this.nativeElement?.dispatchEvent(tuiCreateKeyboardEvent(key, 'keydown'));
        this.fixture.detectChanges();
    }

    public focus(): void {
        this.nativeElement?.focus();
        this.fixture.detectChanges();
    }

    public blur(): void {
        this.nativeElement?.blur();
        this.fixture.detectChanges();
    }

    public click(): void {
        this.nativeElement?.click();
        this.fixture.detectChanges();
    }
}
