import {expect, Page} from '@playwright/test';

import {tuiRemoveElement} from './hide-element';
import {tuiMockDate} from './mock-date';
import {tuiWaitForFonts} from './wait-for-fonts';
import {waitStableState} from './wait-stable-state';

interface TuiGotoOptions extends NonNullable<Parameters<Page['goto']>[1]> {
    date?: Date;
    language?: string;
    hideHeader?: boolean;
    enableNightMode?: boolean;
    hideVersionManager?: boolean;
    hideLanguageSwitcher?: boolean;
}

export async function tuiGoto(
    page: Page,
    url: string,
    {
        date = new Date(2020, 8, 25, 19, 19),
        hideHeader = true,
        enableNightMode = false,
        hideVersionManager = false,
        hideLanguageSwitcher = false,
        language,
        ...playwrightGotoOptions
    }: TuiGotoOptions = {},
): ReturnType<Page['goto']> {
    await page.addInitScript(() => {
        globalThis.Math.random = () => 0.42;
    });
    await page.addInitScript(() =>
        globalThis.sessionStorage.setItem('playwright', 'true'),
    );

    if (enableNightMode) {
        await page.addInitScript(() =>
            globalThis.localStorage.setItem('tuiNight', 'true'),
        );
    }

    if (language) {
        await page.addInitScript(
            lang => globalThis.localStorage.setItem('tuiLanguage', lang),
            language,
        );
    }

    await tuiMockDate(page, date);

    const response = await page.goto(url, playwrightGotoOptions);
    const app = page.locator('app');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');
    await expect(app).toHaveClass(/_loaded/, {timeout: 30_000});
    await tuiWaitForFonts(page);
    await waitStableState(app);

    if (hideHeader) {
        await tuiRemoveElement(page.locator('[tuiDocHeader]'));
    }

    if (hideVersionManager) {
        await tuiRemoveElement(page.locator('version-manager'));
    }

    if (hideLanguageSwitcher) {
        await tuiRemoveElement(page.locator('tui-language-switcher'));
    }

    expect(
        await page.evaluate("matchMedia('(prefers-reduced-motion)').matches"),
    ).toBeTruthy();

    return response;
}
