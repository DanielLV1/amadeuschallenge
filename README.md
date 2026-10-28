# Avianca Automation Challenge - Playwright & BDD

This repository contains an end-to-end test automation suite for Avianca's booking portal (English version: `https://www.avianca.com/en`), built using Playwright, TypeScript, and Playwright-BDD (Cucumber).

---

## 1. Setup and Execution

### Prerequisites
- Node.js (v18 or higher)
- npm
- Google Chrome installed on your machine (we run tests against real Chrome to avoid anti-bot blocks).

### Installation
Clone the repo and install dependencies:
```bash
git clone https://github.com/DanielLV1/amadeuschallenge.git
cd amadeuschallenge
npm install
```

### Running the Tests
1. **Generate BDD steps:**
   Before running tests, always generate the spec files from the `.feature` files:
   ```bash
   npx bddgen
   ```

2. **Execute the test suite:**
   ```bash
   npx playwright test
   ```

   If you want to watch the browser execution in real time:
   ```bash
   npx playwright test --headed
   ```

3. **View reports:**
   - Playwright default report:
     ```bash
     npx playwright show-report
     ```
   - Cucumber HTML report:
     Open `cucumber-report/report.html` in any browser.

---

## 2. E2E Flow and Step Usage

The test covers the main booking flow from the home page all the way to the payment review screen.

Here is how the steps work together, what they expect, and how you can customize the data:

1. **`Given the user navigates to the Avianca portal`**
   - *Previous step:* None (starts the test).
   - *What it does:* Opens Avianca and automatically handles the OneTrust cookie banner if it shows up.
   - *Next step:* Trip type check.

2. **`When the "round trip" option is verified by default`**
   - *Previous step:* Navigates to portal.
   - *What it does:* Verifies the page loaded correctly and that "round trip" is checked by default.
   - *Next step:* Select trip type.

3. **`And selects "one way" option`**
   - *Dynamic parameter:* You can pass `"one way"` or `"round trip"`.
   - *What it does:* Clicks the radio button and hides/shows the return date input accordingly.

4. **`And the destination is "San Andres"`**
   - *Dynamic parameter:* Change `"San Andres"` to any city you want to search.
   - *What it does:* Types in the destination, clicks the matching autocomplete option, and grabs the IATA code (`ADZ`) to save it in context.

5. **`And selects a enabled departure date`**
   - *What it does:* Opens the calendar and picks the 3rd available active day so the test doesn't fail on past dates or unavailable flights. Saves the selected date (`MM/dd/yyyy`) in context.

6. **`Then validates the departure date format`**
   - *What it does:* Uses `date-fns` to strictly check that the date string saved in the context is a real valid calendar date.

7. **`When selects the passengers:`**
   - *Dynamic data (Table):*
     ```gherkin
     | type   | quantity |
     | Adults |        2 |
     ```
   - *How to customize:* You can add rows for `Adults`, `Youth`, `Children`, or `Infants`. The maximum allowed by Avianca is 9 passengers in total.

8. **`Then validates the total passengers selected`**
   - *What it does:* Asserts that the counter displayed in the passenger button matches the sum of the table you provided.

9. **`When confirm initial search`**
   - *What it does:* Grabs the Origin and Destination IATA codes from the inputs (e.g. `MIA` and `ADZ`), stores them in context, clicks Search, and checks that Imperva didn't block the request.

10. **`Then selects best price flight`**
    - *What it does:* Finds the flight option labeled "Best price" and clicks it.

11. **`Then validates all fare options are displayed`**
    - *What it does:* Verifies that all 3 fare cards are present on the screen.

12. **`And selects the cheapest fare`**
    - *What it does:* Reads the prices on the cards, calculates which one is the lowest, clicks it, and saves that initial fare price into the context.

13. **`Then the upgrade pop-up opens if present`**
    - *What it does:* Avianca sometimes shows a "Save more: Choose Classic" upsell popup. If it appears, the test clicks "Continue with restrictions". If it doesn't appear, it simply moves on without failing.

14. **`Then validates the trip summary and continue`**
    - *What it does:* Verifies that the date on the summary matches what we picked, saves the base total price, and clicks Continue.

15. **`And selects continue without sign in`**
    - *What it does:* Clicks the button to proceed as a guest.

16. **`When fills passenger information:`**
    - *Dynamic data (Table):*
      ```gherkin
      | passengerIndex | dataFile             | isBookingHolder |
      |              1 | normalPassenger.json | false           |
      |              2 | holderPassenger.json | true            |
      ```
    - *How to customize:* Each passenger index points to a JSON file in `data/`. One (and only one) passenger must have `isBookingHolder` set to `true`. That passenger's contact info (phone prefix, number, email) will be filled into the Booking Holder section.

17. **`Then selects continue to payment`**
    - *What it does:* Clicks the button to proceed to the ancillary services page.

18. **`Then the Request Services screen opens`**
    - *What it does:* Checks that the "Personalize your trip" header is visible.

19. **`When selects "No, I have what I need" if baggage menu is present`**
    - *Dynamic parameter:* You can send `"No, I have what I need"` or `"Yes, I want to add baggage"`.
    - *What it does:* Avianca only shows this baggage menu for certain fare types or routes. The step is wrapped in a try/catch so if the heading doesn't show up, the test continues without failing.

20. **`Then selects "Priority boarding" service`**
    - *Dynamic parameter:* Accepts the service title as seen on the card (e.g. `"Priority boarding"`). Clicks the card to open its configuration modal.

21. **`Then selects all passegers for the service`**
    - *What it does:* Toggles the "Select all passengers" checkbox inside the service modal.

22. **`Then confirm service`**
    - *What it does:* Clicks the confirm button, reads the "Total added" amount on the card, adds it to the fare price stored in context, and verifies that the new total at the bottom reflects the sum.

23. **`Then clic continue to final payment`**
    - *What it does:* Scrolls to the bottom and clicks "Go to payment".

24. **`And validates the final booking details`**
    - *What it does:* On the final payment review screen, it checks that:
      - The origin IATA matches what we captured at the start (e.g. `MIA`).
      - The destination IATA matches (e.g. `ADZ`).
      - The departure date is displayed in the expected front-end format (e.g. `"Thu, 29 Oct"`).
      - The fare price matches the accumulated price in our context.

---

## 3. Pattern and Design Decisions

For this project, I used a **Page Object Model (POM)** structure adapted to BDD with a **Screenplay-inspired separation of concerns**:
- Because Avianca's booking flow follows a strict step-by-step funnel (Flight Search -> Fare -> Passengers -> Services -> Payment), separating UI locators and page actions into `pages/aviancaHomePage.ts` keeps the step definitions very clean.
- Locators are defined as `readonly` properties in the constructor. Where Avianca alternates between `data-test` and `data-testid` on Angular Material elements, we use fallback locators (`.or(...)`) so the tests don't break if an attribute slightly changes.
- Steps are parameterized so you can change dates, cities, passenger counts, or services directly in the `.feature` file without touching TypeScript code.

---

## 4. Context Management (`homePage.context`)

To avoid hardcoded assertions and keep tests reliable, all runtime data is stored in `homePage.context` (`FlightContext`):
- It tracks `destination`, `originIata`, `destinationIata`, `departureDate`, `passengers`, `farePrice`, and `baggageOption`.
- It resets automatically on every scenario run thanks to the Playwright fixture in `utils/fixtures.ts`.
- When prices or dates are picked in early steps, they are stored in the context. Later steps use those exact stored values for their assertions instead of expecting hardcoded numbers.

---

## 5. Assertions and Defect Handling

Here is how the framework handles tricky front-end behaviors and ensures the UI displays the right information:
- **Price formatting:** Avianca formats prices with commas as decimals (e.g. `USD 285,00`). The helper `parsePrice()` parses these into numbers and uses `expect(...).toBeCloseTo(expectedPrice, 2)` to avoid floating-point rounding mismatches.
- **Date formats:** We use `date-fns` to parse the selected date (`MM/dd/yyyy`) and format it into `"EEE, d MMM"` (e.g. `"Thu, 29 Oct"`) to match what Avianca renders on the checkout screen.
- **IP blocking:** Immediately after running the flight search, we assert that the text `"Access denied"` is not present, failing early with a clear message if Avianca blocks the session.
- **Optional dialogs:** Popups like OneTrust cookies, fare upgrades, and optional baggage menus are handled defensively with try/catch or conditional checks so intermittent modals don't fail the run.

---

## 6. QA Evidence and Reporting

To make sure QA and stakeholders can easily review what happened during each run:
- An `AfterStep` hook in `utils/fixtures.ts` takes a full-page screenshot after **every single step**.
- The `cucumber-report/report.html` embeds these screenshots step by step, creating a clear visual history of the entire booking journey.
- If a test fails, Playwright saves the error context, screenshot, and trace so you can see exactly what the screen looked like at the moment of failure.

---

## 7. Known Limitations and Notes

A few things to keep in mind when running these tests:

1. **Date format mismatch in requirements:** The challenge document mentions `DD/MM/AAAA`, but Avianca's English site renders inputs in `MM/DD/YYYY`. The test handles and verifies `MM/dd/yyyy` with `date-fns`.
2. **Production environment:** Because this runs against the live Avianca website, the test intentionally stops at the payment review screen. We do not complete the actual credit card transaction.
3. **Anti-bot restrictions (Avianca):** Running headless Chromium frequently triggers Avianca's (`Access denied`). 
4. **IP rate limiting:** If you run the test many times in a short period, Avianca might temporarily block your IP address. Using a VPN to switch your location/IP solves this.
5. **Passenger limit:** Avianca only allows up to 9 passengers per booking. Don't set more than 9 in the feature table.
6. **Cookie popup:** The OneTrust banner can block clicks if it stays open. The `goto()` method handles closing it on startup.
7. **Intermittent upsell modals:** The "Save more" fare popup doesn't always show up depending on flight availability, so it's treated as optional.
