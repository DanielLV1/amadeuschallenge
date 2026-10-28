import { Page, Locator, expect } from "@playwright/test";
import { parse, isValid, format } from "date-fns";
import { FlightContext, PassengerType, PASSENGER_TYPES, toPassengerType } from "../utils/flightContext";

    export class aviancaHomePage{
        readonly page: Page;
        readonly context: FlightContext;
        readonly departureDate: Locator;
        readonly origin: Locator;
        readonly oneWayButton: Locator;
        readonly roundTripButton: Locator;
        readonly destination: Locator;
        readonly returnDate: Locator;
        readonly passenger: Locator;
        readonly searchButton: Locator;
        readonly bestPriceFlight: Locator;
        readonly fareCards: Locator;
        readonly bookingDateElement: Locator;
        readonly farePopup: Locator;
        readonly continueWithRestrictions: Locator;
        readonly usdCurrency: Locator;
        readonly continueButton: Locator;
        readonly withoutSignInButton: Locator;
        readonly passengerRegions: Locator;
        readonly passengerName: Locator;
        readonly passengerLastName: Locator;
        readonly passengerGender: Locator;
        readonly passengerBirthDay: Locator;
        readonly passengerBirthMonth: Locator;
        readonly passengerBirthYear: Locator;
        readonly passengerNationality: Locator;
        readonly nextPassengerButton: Locator;
        readonly holderSection: Locator;
        readonly holderPassengerSelect: Locator;
        readonly holderPrefix: Locator;
        readonly holderPhone: Locator;
        readonly holderEmail: Locator;
        readonly holderConfirmEmail: Locator;
        readonly termsCheckbox: Locator;
        readonly promotionsCheckbox: Locator;
        readonly continueToPayment: Locator;
        readonly requestServicesTitle: Locator;
        readonly noBaggageRadio: Locator;
        readonly yesBaggageRadio: Locator;
        readonly baggageHeading: Locator;
        readonly selectAllPassengersCheckbox: Locator;
        readonly confirmService: Locator;
        readonly continueToFinalPayment: Locator;
        readonly serviceAddedPrice: Locator;
        readonly totalBookingPrice: Locator;
        readonly testOriginDetails: Locator;
        readonly testDestination: Locator;
        readonly testDepartureDetails: Locator;
        readonly testFareDetails: Locator;
        readonly testServiceChargePrice: Locator;

        constructor(page: Page, context: FlightContext = {}) {
            this.page = page;
            this.context = context;
            this.origin = page.getByRole('combobox', { name: 'Origin' });
            this.destination = page.getByRole('combobox', { name: 'Destination' });
            this.returnDate = page.getByRole('button', { name: 'Return' });
            this.departureDate = page.getByRole('button', { name: 'Departure' });
            this.passenger = page.getByRole('button', { name: 'Select passengers' });
            this.searchButton = page.getByRole('button', { name: 'Search' });
            this.oneWayButton = page.getByRole('radio', { name: 'One way' });
            this.roundTripButton = page.getByRole('radio', { name: 'Round trip' });
            this.bestPriceFlight = page.locator('button.flight-container').filter({ hasText: 'Best price' }).first();
            this.fareCards = page.getByRole('button', { name: /^Fare type/i });
            this.bookingDateElement = page.locator('time.date').first();
            this.farePopup = page.getByText('Save more: Choose Classic for only $ 90.00 more1 personal item1 carry-on');
            this.continueWithRestrictions = page.getByText('Continue with restrictions');
            this.usdCurrency = page.getByTestId('resume').getByLabel('USD');
            this.continueButton = page.getByRole('button', { name: 'Continue' });
            this.withoutSignInButton = page.getByRole('button', { name: 'Continue without signing in' });
            this.passengerRegions = page.getByRole('region', { name: /(Adult|Youth|Child|Infant)/i });
            this.passengerName = page.getByRole('textbox', { name: 'Name', exact: true });
            this.passengerLastName = page.getByRole('textbox', { name: 'Last name' });
            this.passengerGender = page.getByTestId('gender-select').or(page.getByRole('combobox', { name: /Gender/i }));
            this.passengerBirthDay = page.getByRole('combobox', { name: 'Day' });
            this.passengerBirthMonth = page.getByRole('combobox', { name: 'Month' });
            this.passengerBirthYear = page.getByRole('combobox', { name: 'Year' });
            this.passengerNationality = page.locator('input[data-test="TA-tp-Nationality"]');
            this.nextPassengerButton = page.getByRole('button', { name: 'Next' });
            this.holderSection = page.locator('div').filter({ hasText: /Booking holder/i }).last();
            this.holderPassengerSelect = page.locator('#mat-select-value-0').or(page.getByRole('combobox', { name: /Passenger/i })).first();
            this.holderPrefix = page.getByRole('region', { name: /Booking holder/i }).getByLabel('Open options');
            this.holderPhone = page.getByTestId('phone-input');
            this.holderEmail = page.getByTestId('email-input-element');
            this.holderConfirmEmail = page.getByTestId('confirm-email-input-element');
            this.termsCheckbox = page.getByRole('checkbox', { name: /processing of my/i });
            this.promotionsCheckbox = page.getByRole('checkbox', { name: /use of my/i });
            this.continueToPayment = page.getByTestId('cart-continue-btn'); 
            this.requestServicesTitle = page.getByRole('heading', { name: 'Personalize your trip' });
            this.noBaggageRadio = page.getByRole('radio', { name: /No, I have what I need/i });
            this.yesBaggageRadio = page.getByRole('radio', { name: /Yes, I want to add baggage/i });
            this.baggageHeading = page.getByRole('heading', { name: 'Do you need more baggage?' });
            this.selectAllPassengersCheckbox = page.getByRole('checkbox', { name: 'Select all passengers USD' });
            this.confirmService = page.getByTestId('nbf-button');
            this.continueToFinalPayment = page.getByTestId('order-continue-btn-footer-static')
                .or(page.locator('[data-test="order-continue-btn-footer-static"]'))
                .or(page.getByRole('button', { name: /Go to payment/i }))
                .first();
            this.serviceAddedPrice = page.getByTestId('ancilliaries-card-PBRD').getByText('USD').first();
            this.totalBookingPrice = page.getByTestId('not-sticky-cart-sticky-bottom').getByText('USD').nth(1);
            this.testOriginDetails = page.getByTestId('testOriginDetails')
                .or(page.locator('[data-test="testOriginDetails"]'))
                .first();
            this.testDestination = page.getByTestId('testDestination')
                .or(page.locator('[data-test="testDestination"]'))
                .first();
            this.testDepartureDetails = page.getByTestId('testDeparturedetails')
                .or(page.locator('[data-test="testDeparturedetails"]'))
                .first();
            this.testFareDetails = page.getByTestId('testfareDetails')
                .or(page.locator('[data-test="testfareDetails"]'))
                .first();
            this.testServiceChargePrice = page.getByTestId('testServiceChargePrice')
                .or(page.locator('[data-test="testServiceChargePrice"]'))
                .first();
        }

        async goto() {
            await this.page.goto('/');
            const cookiesBtn = this.page.locator('#onetrust-accept-btn-handler');
            try {
                await cookiesBtn.waitFor({ state: 'visible', timeout: 7000 });
                await cookiesBtn.click();
            } catch (e) {
                // Si no aparece o ya fue aceptado
            }
            
        }
        async validateHomePageIsLoaded() {
            await expect(this.origin).toBeEnabled();
            await expect(this.destination).toBeEnabled();
            await expect(this.oneWayButton).toBeEnabled();
            expect(await this.oneWayButton.getAttribute('aria-checked')).toBe('false');
            await expect(this.roundTripButton).toBeEnabled();
            expect(await this.roundTripButton.getAttribute('aria-checked')).toBe('true');
        }

        async selectTripType(tripType: string) {
            const formatted = tripType.toLowerCase().trim();
            if (formatted.includes('one way')) {
                await this.oneWayButton.check();
                await expect(this.returnDate).toBeHidden();
            } else if (formatted.includes('round trip')) {
                await this.roundTripButton.check();
                await expect(this.returnDate).toBeEnabled();
            }
        }

        // extrae codigo iata de tres letras
        extractIata(text: string): string | undefined {
            if (!text) return undefined;
            const parenMatch = text.match(/\(([A-Z]{3})\)/);
            if (parenMatch) return parenMatch[1];

            const endMatch = text.match(/\b([A-Z]{3})\s*$/);
            if (endMatch) return endMatch[1];

            const matches = text.match(/\b[A-Z]{3}\b/g);
            if (matches && matches.length > 0) {
                return matches[matches.length - 1];
            }
            return undefined;
        }

        // obtiene codigo iata del campo o sus atributos
        async getIataFromField(field: Locator): Promise<string | undefined> {
            const val = await field.inputValue().catch(() => '');
            let iata = this.extractIata(val);
            if (iata) return iata;

            const ariaLabel = await field.getAttribute('aria-label').catch(() => '');
            iata = this.extractIata(ariaLabel || '');
            if (iata) return iata;

            const parentText = await field.locator('..').innerText().catch(() => '');
            iata = this.extractIata(parentText);
            if (iata) return iata;

            return undefined;
        }

        async enterOrigin(origin: string) {
            await this.origin.click();
            await this.origin.fill(origin);
            const option = this.page.getByRole('option', { name: origin }).first();
            const optionText = await option.innerText().catch(() => '');
            await option.click();
            this.context.origin = origin;
            const iata = this.extractIata(optionText);
            if (iata) {
                this.context.originIata = iata;
                console.log(`Origen: ${this.context.origin} IATA: ${this.context.originIata}`);
            }
        }

        async enterDestination(destination: string) {
            await this.destination.click();
            await this.destination.pressSequentially(destination, { delay: 100 });
            const option = this.page.getByRole('option', { name: destination }).first();
            const optionText = await option.innerText().catch(() => '');
            await option.click();
            this.context.destination = destination;
            const iata = this.extractIata(optionText);
            if (iata) {
                this.context.destinationIata = iata;
                console.log(`Destino: ${this.context.destination} IATA: ${this.context.destinationIata}`);
            }
        }
        async selectDepartureDate() {
            //seleccionar tercero  
            const availableDay = this.page.locator('button[data-name="dayCell"][aria-disabled="false"]').nth(2);
            await availableDay.waitFor({ state: 'visible', timeout: 5000 });
            await availableDay.click();
            // espera a que el campo tenga un valor con fecha
            await expect(this.departureDate).toHaveValue(/\d/);
            const value = await this.departureDate.inputValue();
            this.context.departureDate = value.trim();
        }
        async validateDepartureDateFormat() {
            // valida formato estricto dd/MM/yyyy con date-fns
            const parsedDate = parse(this.context.departureDate || '', 'MM/dd/yyyy', new Date());
            expect(isValid(parsedDate)).toBe(true);
        }

        // fila del panel de pasajeros Adults Youth Children Infants
        passengerRow(type: PassengerType): Locator {
            return this.page.locator('div')
                .filter({ has: this.page.getByText(type, { exact: true }) })
                .filter({ has: this.page.getByRole('button', { name: 'Increase' }) })
                .last();
        }

        async openPassengersPanel() {
            // el panel puede abrirse solo despues de elegir la fecha
            const panelTitle = this.page.getByRole('heading', { name: "Who's flying?" });
            if (!(await panelTitle.isVisible())) {
                await this.passenger.click();
            }
            await expect(panelTitle).toBeVisible();
        }

        async setPassengerCount(type: PassengerType, target: number) {
            const row = this.passengerRow(type);
            const minus = row.getByRole('button', { name: 'Decrease' });
            const plus = row.getByRole('button', { name: 'Increase' });
            const counter = row.getByText(/^\d+$/);

            let current = Number(await counter.innerText());
            while (current !== target) {
                const button = current < target ? plus : minus;
                await expect(button, `no se puede llegar a ${target} ${type}`).toBeEnabled();
                await button.click();
                current += current < target ? 1 : -1;
                await expect(counter).toHaveText(String(current));
            }
            if (target > 1) {
                // si supera un pasajero valida que ambos botones esten habilitados
                await expect(plus).toHaveAttribute('aria-disabled', 'false');
                await expect(minus).toHaveAttribute('aria-disabled', 'false');
            }
            this.context.passengers = { ...this.context.passengers, [type]: target };

        }

        async selectPassengers(passengers: { type: string; quantity: number }[]) {
            await this.openPassengersPanel();
            // adultos primero porque infants depende de la cantidad de adultos
            const sorted = passengers
                .map(p => ({ type: toPassengerType(p.type), quantity: p.quantity }))
                .sort((a, b) => PASSENGER_TYPES.indexOf(a.type) - PASSENGER_TYPES.indexOf(b.type));
            for (const p of sorted) {
                await this.setPassengerCount(p.type, p.quantity);
            }
            await this.page.getByRole('button', { name: 'Confirm' }).click();
        }

        totalPassengers(): number {
            return Object.values(this.context.passengers ?? {}).reduce((a, b) => a + b, 0);
        }

        async validatePassengersQuantity(quantity: string) {
            await expect(this.passenger).toHaveText(new RegExp(`Passengers\\s*${quantity}\\s*$`));
        }
        async confirmInitialSearch() {
            // guarda codigos iata en el contexto antes de buscar
            this.context.originIata = await this.getIataFromField(this.origin) || this.context.originIata;
            this.context.destinationIata = await this.getIataFromField(this.destination) || this.context.destinationIata;
            console.log(`IATA Origin: ${this.context.originIata} IATA Destination: ${this.context.destinationIata}`);

            await this.searchButton.click();
            await this.page.waitForURL(/booking\.avianca\.com/, { timeout: 30000 });
            
            // falla con mensaje claro si el firewall bloquea la busqueda
            await expect(
                this.page.getByText('Access denied', { exact: true }),
                'Imperva bloqueo la busqueda Access denied'
            ).toHaveCount(0, { timeout: 10000 });

            
        }
        async validateDepartureDate() {
            if (this.context.departureDate) {
                const dateObj = parse(this.context.departureDate, 'MM/dd/yyyy', new Date());
                const expectedDay = format(dateObj, 'd');
                const expectedYear = format(dateObj, 'yyyy');
                await expect(this.bookingDateElement).toBeVisible({ timeout: 50000 });
                await expect(this.bookingDateElement).toContainText(expectedDay);
                await expect(this.bookingDateElement).toContainText(expectedYear);
                console.log(`Date recived in homepage: ${this.context.departureDate}`);
                console.log(`Date expected in homepage: ${expectedDay}/${expectedYear}`);
            }
        }
        async selectBestPriceFlight() {
            await this.page.waitForLoadState('domcontentloaded', { timeout: 50000 });
            await this.bestPriceFlight.waitFor({ state: 'visible', timeout: 50000 });
            await this.bestPriceFlight.click();
        }

        async validateAllFareOptionsAreDisplayed() {
            // valida que las opciones de tarifa esten visibles
            await expect(this.fareCards.first()).toBeVisible({ timeout: 20000 });

            // valida que existan las 3 tarifas principales
            await expect(this.fareCards).toHaveCount(3);
        }

        async selectCheapestFare() {
            await this.fareCards.first().waitFor({ state: 'visible', timeout: 20000 });
            const prices = (await this.fareCards.allInnerTexts()).map(t => parseFloat(t.replace(/[^\d]/g, '')));
            const minIndex = prices.indexOf(Math.min(...prices));
            await this.fareCards.nth(minIndex).click();
            //guarda en context el precio seleccionado
            this.context.farePrice = prices[minIndex];
            console.log(`Precio seleccionado: ${this.context.farePrice}`);
            
        }
        async handleUpgradePopupIfPresent() {
            try {
                await this.continueWithRestrictions.waitFor({ state: 'visible', timeout: 5000 });
                await this.continueWithRestrictions.click();
                console.log('Upgrade popup showed, continue with restrictions');
            } catch {
                console.log('Upgrade popup not showed, continue ');
            }
        }
        async verifyTripSummary() {
            await expect(this.usdCurrency).toBeVisible({ timeout: 20000 });
            const totalText = await this.usdCurrency.innerText();
            this.context.farePrice = this.parsePrice(totalText);
            console.log(`Total prize on summary: ${this.context.farePrice}`);
            await expect(this.continueButton).toBeVisible({ timeout: 20000 });
            await this.continueButton.click();
        }
        async clickContinueWithoutSignIn() {
            await this.withoutSignInButton.click();
        }

        passengerHeader(index: number): Locator {
            return this.page.getByRole('button', { name: new RegExp(`(Adult|Youth|Child|Infant)\\s*${index}`, 'i') });
        }

        passengerCard(index: number): Locator {
            return this.page.getByRole('region', { name: new RegExp(`(Adult|Youth|Child|Infant)\\s*${index}`, 'i') });
        }

        async fillPassengerForm(index: number, data: any) {
            // abre seccion si no esta visible
            const card = this.passengerCard(index);
            if (!(await card.isVisible())) {
                const header = this.passengerHeader(index);
                await header.scrollIntoViewIfNeeded();
                await header.click();
            }
            await card.waitFor({ state: 'visible', timeout: 20000 });

            // selecciona genero
            await card.locator(this.passengerGender).first().click();
            await this.page.getByRole('option', { name: data.gender })
                .or(this.page.getByRole('listbox').getByText(data.gender, { exact: true }))
                .first().click();

            // ingresa nombres y apellidos
            await card.locator(this.passengerName).fill(data.name);
            await card.locator(this.passengerLastName).fill(data.lastName);

            // ingresa fecha de nacimiento
            await card.locator(this.passengerBirthDay).click();
            await this.page.getByRole('option', { name: String(Number(data.birthDate.day)), exact: true }).click();

            await card.locator(this.passengerBirthMonth).click();
            await this.page.getByRole('option', { name: new RegExp(data.birthDate.month, 'i') }).click();

            await card.locator(this.passengerBirthYear).click();
            await this.page.getByRole('option', { name: data.birthDate.year }).click();

            // ingresa nacionalidad y selecciona la primera opcion
            const natField = card.locator(this.passengerNationality);
            await natField.fill(data.nationality);
            await this.page.getByRole('option', { name: data.nationality })
                .or(this.page.locator(`[data-test="TA-tp-${data.nationality}"]`))
                .or(this.page.getByText(data.nationality, { exact: true }))
                .first().click();

            // avanza al siguiente paso
            const nextBtn = card.locator(this.nextPassengerButton);
            if (await nextBtn.isVisible()) {
                await nextBtn.click();
            }
        }

        async fillBookingHolder(data: any) {
            const holderHeader = this.page.getByRole('button', { name: /Booking holder/i });
            await holderHeader.scrollIntoViewIfNeeded();


            // selecciona titular de la reserva
            await this.holderPassengerSelect.scrollIntoViewIfNeeded();
            await this.holderPassengerSelect.click();
            await this.page.getByRole('option', { name: new RegExp(`${data.name}\\s*${data.lastName}`, 'i') }).click();

            // ingresa datos de contacto
            if (data.contact?.prefix) {
                await this.holderPrefix.scrollIntoViewIfNeeded();
                await this.holderPrefix.click();
                await this.page.getByRole('option', { name: data.contact.prefix }).click();
            }
            if (data.contact?.phone) {
                await this.holderPhone.fill(data.contact.phone);
            }
            if (data.contact?.email) {
                await this.holderEmail.fill(data.contact.email);
                await this.holderConfirmEmail.fill(data.contact.email);
            }

            // acepta politicas y terminos
            await this.termsCheckbox.check();
            await this.promotionsCheckbox.check();
        }

        async selectBaggageOption(option: string) {
            try {
                await this.baggageHeading.waitFor({ state: 'visible', timeout: 15000 });
                const formatted = option.toLowerCase();
                const targetRadio = formatted.includes('yes') ? this.yesBaggageRadio : this.noBaggageRadio;
                if (!await targetRadio.isVisible()) {
                    await this.baggageHeading.click();
                }
                await targetRadio.check();
                // guarda en contexto opcion elegida
                this.context.baggageOption = option;
            } catch {
                // si no encuentra el texto continua sin fallar
            }
        }

        async selectService(service: string) {
            const serviceElement = this.page.getByText(service).first();
            await serviceElement.click();
            const serviceTitle = this.page.getByRole('heading', { name: service });
            await serviceTitle.waitFor({ state: 'visible', timeout: 20000 });
        }

        // extrae valor numerico del texto de moneda
        parsePrice(text: string): number {
            const clean = text.replace(/[^0-9,.]/g, '').trim();
            if (clean.includes(',') && clean.includes('.')) {
                return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
            }
            if (clean.includes(',')) {
                return parseFloat(clean.replace(',', '.'));
            }
            return parseFloat(clean) || 0;
        }

        // valida que la suma coincida con el total de la reserva
        async validateTotalWithAddedService() {
            await this.serviceAddedPrice.waitFor({ state: 'visible', timeout: 15000 });
            const addedText = await this.serviceAddedPrice.innerText();
            const addedPrice = this.parsePrice(addedText);

            const initialPrice = this.context.farePrice || 0;
            const expectedTotal = initialPrice + addedPrice;

            await this.totalBookingPrice.waitFor({ state: 'visible', timeout: 15000 });
            const totalBookingText = await this.totalBookingPrice.innerText();
            const actualTotal = this.parsePrice(totalBookingText);

            console.log(`Precio base: ${initialPrice} Adicional: ${addedPrice} Esperado: ${expectedTotal} Actual: ${actualTotal}`);
            expect(actualTotal).toBeCloseTo(expectedTotal, 2);

            // actualiza precio acumulado en contexto
            this.context.farePrice = actualTotal;
        }

        // valida origen destino fecha y tarifa en el paso de pago
        async validateFinalBookingDetails() {
            // valida origen y destino iata
            if (this.context.originIata) {
                await expect(this.testOriginDetails).toBeVisible({ timeout: 30000 });
                await expect(this.testOriginDetails).toContainText(this.context.originIata);
            }
            if (this.context.destinationIata) {
                await expect(this.testDestination).toBeVisible({ timeout: 30000 });
                await expect(this.testDestination).toContainText(this.context.destinationIata);
            }

            // formatea y valida fecha visible
            if (this.context.departureDate) {
                const dateObj = parse(this.context.departureDate, 'MM/dd/yyyy', new Date());
                const expectedFrontDate = format(dateObj, 'EEE, d MMM');
                await expect(this.testDepartureDetails).toBeVisible({ timeout: 30000 });
                await expect(this.testDepartureDetails).toContainText(expectedFrontDate);
            }

            // valida que el precio final coincida con el farePrice del contexto
            await expect(this.testFareDetails).toBeVisible({ timeout: 30000 });
            const fareText = await this.testFareDetails.innerText();
            const farePrice = this.parsePrice(fareText);

            const expectedPrice = this.context.farePrice || 0;
            console.log(`Tarifa final: ${farePrice} Esperado: ${expectedPrice}`);
            expect(farePrice).toBeCloseTo(expectedPrice, 2);
            


        }
        

    }
