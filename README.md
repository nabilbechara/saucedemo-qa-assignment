# SauceDemo QA Automation Suite

TypeScript + Playwright Test automation for the SauceDemo QA Automation Engineer technical assignment.

## Prerequisites

- Node.js 18+ (tested with Node 22)
- npm

## Installation

```bash
npm ci
npx playwright install --with-deps
```

## Running the suite

```bash
npm test              # headless run, all scenarios
npm run test:headed   # same suite with the browser UI visible
npm run report        # opens the last HTML report
npm run typecheck     # TypeScript check with no build output
```

To run a single spec or scenario:

```bash
npx playwright test tests/a3-product-sorting.spec.ts
npx playwright test -g "checkout"
```

## Project structure

```
playwright.config.ts        baseURL, reporter, and failure-evidence settings
src/
  pages/                    one Page Object per SauceDemo screen (Login, Inventory, Cart, Checkout x2, Complete)
  fixtures/pages.ts         wires page objects into Playwright's test fixtures,
                             including a `loggedInAsStandardUser` fixture for tests
                             that need to start past the login screen
  data/                     test data: user credentials, checkout form data
  utils/                    currency parsing and ascending-order check, used to
                             turn displayed strings into numbers for assertions
tests/                      one spec per required scenario (A1-A7)
```

## Design choices

- **Page Object Model via fixtures**, not a shared base class: each page exposes its
  own locators and the handful of actions/assertions relevant to it, and tests compose
  them through fixtures rather than reaching into `page` directly. This keeps test
  bodies read like the user journey they exercise.
- **Locators**: role, label, placeholder, and SauceDemo's own `data-test` attributes
  (via `page.getByTestId`, configured with `testIdAttribute: 'data-test'`) — no CSS or
  XPath selectors. Products are looked up by visible name (`getByTestId('inventory-item').filter({ hasText: name })`)
  rather than by computing the `add-to-cart-<slug>` id, so the tests don't depend on
  an internal naming convention.
- **Numeric assertions**: prices, quantities, and checkout totals are parsed out of
  their `$X.XX` / text form into numbers (`src/utils/currency.ts`) before being
  compared, per the assignment's requirement to compare values rather than formatted
  strings. The checkout test asserts `total === itemTotal + tax` rather than a
  hardcoded total, so it holds regardless of catalog price changes.
- **Synchronization**: no `waitForTimeout`. Web-first assertions (`expect(locator)...`)
  are used throughout; the one case with no natural web-first assertion — proving a
  client-side sort re-render has settled — uses Playwright's `expect(callback).toPass()`
  polling helper instead of a fixed sleep.
- **Isolation**: every test logs in for itself (there is no shared `storageState`), so
  each test is independently runnable and safe to parallelize; A6 includes a test whose
  only job is to demonstrate that a fresh test starts unauthenticated regardless of
  what ran before it.
- **Failure evidence**: `playwright.config.ts` sets `screenshot: 'only-on-failure'`,
  `trace: 'retain-on-failure'`, and `video: 'retain-on-failure'`, plus the HTML
  reporter, so a failing run always leaves a screenshot, trace, and video to debug
  from without re-running.
- **Dependency pinning**: `@playwright/test` is pinned to an exact version rather than
  a caret range, so `npm ci` reproduces the same browser build on every machine.

## Assumptions

- A2 ("Rejected login") is automated against `locked_out_user`, which SauceDemo
  documents as always producing a login error; this is the most direct way to prove
  both "visible error" and "no authenticated access" in one deterministic test.
- A4 uses "Sauce Labs Backpack" and "Sauce Labs Bike Light" as the two specific
  products; any two catalog items would exercise the same behavior.
- A5 checks out a single product. The total-calculation assertion
  (`total === itemTotal + tax`) is written to generalize to any cart size, but only a
  single-item cart is exercised here to keep the scenario focused, per A5's wording.
- A6 ("Session cleanup") is read as covering two related claims — logout actually ends
  the session, and tests don't depend on each other's state — so it is implemented as
  two small tests instead of one. See the note at the bottom of `TEST_PLAN.md`.

## Known limitations

- The suite runs against the live public SauceDemo site rather than a local mock, so a
  failure could in principle come from that site changing or being unavailable rather
  than from a real regression; there is no mock/staging fallback.
- Only Chromium is configured, per the assignment's stated primary browser. Firefox/WebKit
  projects can be added to `playwright.config.ts` if cross-browser coverage is needed.
- `tests/a7-exploratory-problem-user.spec.ts` intentionally asserts the *current, buggy*
  `problem_user` sort behavior (see `BUG_REPORT.md`) so the suite fails loudly the day
  that bug is fixed — treat a failure there as good news, not a regression.
- No CI workflow is included; the assignment only asked for a suite runnable from a
  clean checkout.
