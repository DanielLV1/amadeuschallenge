import { test as base, createBdd } from "playwright-bdd";
import { aviancaHomePage } from "../pages/aviancaHomePage";
import { FlightContext } from "./flightContext";

type Fixtures = {
    flightContext: FlightContext;
    homePage: aviancaHomePage;
};

// un contexto y una instancia por escenario compartidos entre steps
export const test = base.extend<Fixtures>({
    flightContext: async ({}, use) => {
        await use({});
    },
    homePage: async ({ page, flightContext }, use) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        });
        await use(new aviancaHomePage(page, flightContext));
    },
});

export const { Given, When, Then, AfterStep } = createBdd(test);

// captura de pantalla al terminar cada step
AfterStep(async ({ page, $testInfo }) => {
    const screenshot = await page.screenshot();
    await $testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
    });
});
