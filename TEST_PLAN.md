# Test Plan

Test application: [SauceDemo](https://www.saucedemo.com/)

| ID | Scenario | Purpose | Risk if broken | Expected result | Automation status |
|----|----------|---------|-----------------|------------------|--------------------|
| A1 | Successful login | Confirm a valid, active account can authenticate and reach the app. | Users cannot access the store at all; total revenue loss. | `standard_user` logs in and lands on `/inventory.html` with the "Products" title and at least one product listed. | Automated — [tests/a1-login-success.spec.ts](tests/a1-login-success.spec.ts) |
| A2 | Rejected login | Confirm the app blocks a known-bad account and gives clear feedback. | An account-lockout bypass would be a security issue; a missing/unclear error increases support load. | `locked_out_user` stays on the login page, sees the "locked out" error, and never reaches `/inventory.html`. | Automated — [tests/a2-login-rejected.spec.ts](tests/a2-login-rejected.spec.ts) |
| A3 | Product sorting | Confirm the "Price (low to high)" sort actually reorders the catalog by price. | Customers can't find the cheapest item; merchandising/sort features are a common regression point. | After selecting "Price (low to high)", every displayed price, parsed as a number, is in non-decreasing order. | Automated — [tests/a3-product-sorting.spec.ts](tests/a3-product-sorting.spec.ts) |
| A4 | Cart behavior | Confirm adding items updates the cart badge and that the cart holds the right products, prices, and quantities. | Wrong cart contents directly cause billing/fulfillment errors. | After adding two specific products, the cart badge reads "2" and the cart page shows both products with quantity 1 and prices matching the catalog. | Automated — [tests/a4-cart-behavior.spec.ts](tests/a4-cart-behavior.spec.ts) |
| A5 | Checkout | Confirm the checkout flow computes totals correctly and confirms the order. | Incorrect tax/total calculation is a direct financial and trust issue. | Item total matches the cart price, `total = item total + tax`, and the completion page shows "Thank you for your order!". | Automated — [tests/a5-checkout.spec.ts](tests/a5-checkout.spec.ts) |
| A6 | Session cleanup | Confirm logout ends the session and that tests do not leak state between runs. | Session leakage could expose one user's cart/order to another; flaky order-dependent tests hide real regressions. | Logout returns to the login page and blocks direct navigation back to `/inventory.html`; a fresh test starts unauthenticated with no assumptions from prior tests. | Automated — [tests/a6-session-cleanup.spec.ts](tests/a6-session-cleanup.spec.ts) |
| A7 | Exploratory check (`problem_user`) | Use exploratory testing to surface a defect specific to the intentionally-broken `problem_user` account. | Undetected defects in a known-risky account path ship to users. | One reproducible defect is found and documented, or the checked area is recorded with evidence that it behaved correctly. | Explored manually, defect found and automated as a regression check — [tests/a7-exploratory-problem-user.spec.ts](tests/a7-exploratory-problem-user.spec.ts); full write-up in [BUG_REPORT.md](BUG_REPORT.md) |

## Notes on A6

A6 is implemented as two independent tests rather than one, since it covers two distinct claims from the scenario:

1. Logging out ends the session and blocks direct access to authenticated pages.
2. Every test (including this suite's own other tests) starts from a clean, unauthenticated state, with no reliance on execution order.

The second test is a direct, minimal demonstration of isolation: it makes no assumptions about prior tests and would pass whether run first, last, or alone.
