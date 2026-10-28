import { expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Given, When, Then } from "../utils/fixtures";
import * as fs from "fs";
import * as path from "path";

Given('the user navigates to the Avianca portal', async ({ homePage }) => {
    await homePage.goto();
});

When('the "round trip" option is verified by default', async ({ homePage }) => {
    await homePage.validateHomePageIsLoaded();
});

When('selects {string} option', async ({ homePage }, tripType: string) => {
    await homePage.selectTripType(tripType);
});

When('the origin is {string}', async ({ homePage }, origin: string) => {
    await homePage.enterOrigin(origin);
    await expect(homePage.origin).toHaveValue(new RegExp(homePage.context.origin!));
});

When('the destination is {string}', async ({ homePage }, destination: string) => {
    await homePage.enterDestination(destination);
    await expect(homePage.destination).toHaveValue(new RegExp(homePage.context.destination!));
});

When('selects a enabled departure date', async ({ homePage }) => {
    await homePage.selectDepartureDate();
    console.log(`Destino: ${homePage.context.destination} Fecha: ${homePage.context.departureDate}`);
});
Then('validates the departure date format', async ({ homePage }) => {
    await homePage.validateDepartureDateFormat();
});
When('selects the passengers:', async ({ homePage }, table: DataTable) => {
    const passengers = table.hashes().map(row => ({
        type: row.type,
        quantity: Number(row.quantity),
    }));
    await homePage.selectPassengers(passengers);
});
Then('validates passengers quantity is {string}', async ({ homePage }, passengersQuantity: string) => {
    await homePage.validatePassengersQuantity(passengersQuantity);
});
Then('validates the total passengers selected', async ({ homePage }) => {
    await homePage.validatePassengersQuantity(String(homePage.totalPassengers()));
});
When('confirm initial search', async ({ homePage }) => {
    await homePage.confirmInitialSearch();
    await homePage.validateDepartureDate();
    
});
Then('selects best price flight', async ({ homePage }) => {
    await homePage.selectBestPriceFlight();
});
Then('validates all fare options are displayed', async ({ homePage }) => {
    await homePage.validateAllFareOptionsAreDisplayed();
});
Then('selects the cheapest fare', async ({ homePage }) => {
    await homePage.selectCheapestFare();
});
Then('the upgrade pop-up opens if present', async ({ homePage }) => {
    await homePage.handleUpgradePopupIfPresent();
});
Then('validates the trip summary and continue', async ({ homePage }) => {
    await homePage.validateDepartureDate()
    await homePage.verifyTripSummary();
});
When('selects continue without sign in', async ({ homePage }) => {
    await homePage.clickContinueWithoutSignIn();
});
When('fills passenger information:', async ({ homePage }, table: DataTable) => {
    const rows = table.hashes();

    // valida cantidad de pasajeros segun el context
    const expectedCount = homePage.totalPassengers();
    if (expectedCount > 0 && rows.length !== expectedCount) {
        throw new Error(`La cantidad de registros ${rows.length} no coincide con los pasajeros seleccionados ${expectedCount}`);
    }

    // valida que solo un pasajero sea titular
    const holderRow = rows.find(r => r.isBookingHolder?.toLowerCase() === 'true');
    const holders = rows.filter(r => r.isBookingHolder?.toLowerCase() === 'true');
    if (holders.length !== 1 || !holderRow) {
        throw new Error('Solo un pasajero debe tener isBookingHolder en true');
    }

    // llena datos de todos los pasajeros primero
    for (const row of rows) {
        const filePath = path.resolve(__dirname, `../data/${row.dataFile}`);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        await homePage.fillPassengerForm(Number(row.passengerIndex), data);
    }

    // llena datos del titular de la reserva al salir del ciclo
    const holderPath = path.resolve(__dirname, `../data/${holderRow.dataFile}`);
    const holderData = JSON.parse(fs.readFileSync(holderPath, 'utf-8'));
    await homePage.fillBookingHolder(holderData);
});
When('selects continue to payment', async ({ homePage }) => {
    await homePage.continueToPayment.click();
    
});

Then('the Request Services screen opens', async ({ homePage }) => {
  await expect(homePage.requestServicesTitle).toBeVisible();
});
When('selects {string} if baggage menu is present', async ({ homePage }, option: string) => {
  await homePage.selectBaggageOption(option);
});
When('selects {string} service', async ({ homePage }, service: string) => {
  await homePage.selectService(service);
});
When('selects all passegers for the service', async ({ homePage }) => {
  await homePage.selectAllPassengersCheckbox.check();
});
Then('confirm service', async ({ homePage }) => {
    await homePage.confirmService.click();
    await expect(homePage.requestServicesTitle).toBeVisible({timeout: 60000});
    await homePage.continueToFinalPayment.scrollIntoViewIfNeeded();
    expect(homePage.continueToFinalPayment).toBeVisible({timeout: 60000});
    await homePage.validateTotalWithAddedService();
});
Then('clic continue to final payment', async ({ homePage }) => {
    await homePage.continueToFinalPayment.scrollIntoViewIfNeeded();
    await homePage.continueToFinalPayment.click();
});

Then('validates the final booking details', async ({ homePage }) => {
    await homePage.validateFinalBookingDetails();
});



  