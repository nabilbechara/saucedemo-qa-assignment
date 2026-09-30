# Bug Report — Exploratory Check (A7)

## Area explored

`problem_user` on the inventory page (`/inventory.html`), focusing on the product-sort control, since `problem_user` is documented by SauceDemo as an intentionally broken account and sorting is a common regression point (see A3).

## Defect found

**Title:** Selecting "Price (low to high)" has no effect on the displayed product order for `problem_user`.

**Steps to reproduce:**
1. Go to https://www.saucedemo.com/.
2. Log in as `problem_user` / `secret_sauce`.
3. On the inventory page, open the sort dropdown and select "Price (low to high)".

**Expected result:** The product list re-renders with prices in ascending order, the same way it does for `standard_user`.

**Actual result:** The list order does not change at all. The displayed order after selecting "Price (low to high)" is byte-for-byte identical to the default "Name (A to Z)" order, and the resulting prices are not ascending.

**Evidence (prices in displayed order, `problem_user`):**

| Sort selected | Displayed prices |
|---|---|
| (default, "Name (A to Z)") | $29.99, $9.99, $15.99, $49.99, $7.99, $15.99 |
| "Price (low to high)" | $29.99, $9.99, $15.99, $49.99, $7.99, $15.99 *(unchanged)* |

For comparison, `standard_user` on the same action:

| Sort selected | Displayed prices |
|---|---|
| (default, "Name (A to Z)") | $29.99, $9.99, $15.99, $49.99, $7.99, $15.99 |
| "Price (low to high)" | $7.99, $9.99, $15.99, $15.99, $29.99, $49.99 |

**Environment:** SauceDemo (https://www.saucedemo.com/), Chromium (Playwright), macOS/Windows — behavior is purely client-side (React state), so it is not OS/browser-specific.

**Impact:** Low-to-medium. `problem_user` is a demo/test account, not a real customer segment, but the underlying pattern — a sort or filter control that silently does nothing — is exactly the class of bug that erodes trust in "the UI says X but the data says Y." If this control were wired the same way for a real account, customers sorting by price would see no effect and could not find the cheapest or most expensive items.

**Automated regression check:** [tests/a7-exploratory-problem-user.spec.ts](tests/a7-exploratory-problem-user.spec.ts) locks in this actual (buggy) behavior — it will fail loudly, calling out the mismatch, the moment the sort starts working for `problem_user`, which is the signal that this report should be closed out.

## Other areas checked, no defect found

- Add-to-cart and remove-from-cart buttons on the inventory page for `problem_user` update the cart badge correctly.
- Login and logout for `problem_user` behave the same as `standard_user`.

These were spot-checked manually during exploration but were not the focus of this report, since A7 asks for one reproducible defect (or one documented checked area) rather than a full regression pass.
