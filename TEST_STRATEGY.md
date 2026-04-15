# Test Strategy — WD Suite

## 1. Application Overview

WD Suite is a commercial real estate research platform by Walker & Dunlop with two core modules:

**WD Suite Research** — Property search, neighborhood analysis, tenant credit scoring, demographic data, local amenities, and multifamily valuation tools.

**WD Suite Servicing** — Loan management hub for existing Walker & Dunlop clients. Provides loan details, payment history, escrow balances, billing statements, and document management.

The application has two distinct user states with a clear access boundary:
- **Pre-login** — Google Places autocomplete and basic neighborhood data accessible publicly
- **Post-login** — Full property data, tenant credit scores, ratings, and dashboard features require Bearer token authentication (Okta OAuth2)

---

## 2. Application Functionality Map

### Research Module
| Feature | Pre-login | Post-login |
|---------|-----------|------------|
| Property search (Google Places autocomplete) | ✅ | ✅ |
| Property detail — Overview | Limited | Full |
| Macroeconomic indicators | ✅ | ✅ |
| Neighborhood ratings (Safety, Housing, Demographics, Amenities) | Limited | Full |
| Tenant credit score | ❌ (Sign Up CTA) | ✅ |
| Multifamily Valuation (AVM) | ❌ | ✅ |
| Transaction history | Limited | Full |
| Interactive map (Mapbox) | ✅ | ✅ |
| Demographic analysis | ✅ | ✅ |
| Local amenities (Employers, Education, Transit, Retail, Restaurants, Entertainment) | ✅ | ✅ |
| Save to Dashboard | ❌ | ✅ |
| My Dashboard — manage saved properties | ❌ | ✅ |

### Servicing Module
| Feature | Notes |
|---------|-------|
| Loan details & payment history | Requires real loan data |
| Escrow balances & billing statements | Requires real loan data |
| Document upload/download | Requires real loan data |
| Insurance transparency | Requires real loan data |

---

## 3. Most Important User Journeys

**1. Property Search Flow** *(Highest Risk)*
The core acquisition funnel. A user searches for a property by name or address, selects a result from Google Places autocomplete, and lands on the property detail page. This flow is the entry point for all other features — if it breaks, nothing else works.

**2. Pre-login vs Post-login Access Boundary** *(Highest Risk)*
The clearest business rule in the application: unauthenticated users hit a signup modal when attempting to access restricted data. This gate must work correctly — a failure here means free access to paid features.

**3. Authenticated Property Research** *(Highest Risk)*
A logged-in user views tenant credit scores, neighborhood ratings, and macroeconomic indicators for a property. This is the primary value proposition of WD Suite — the data that differentiates it from free alternatives.

**4. Save to Dashboard** *(High Risk)*
A user saves a property to their personalized dashboard for ongoing monitoring. This is a core retention feature — broken saves directly impact user trust and re-engagement.

**5. Multifamily Valuation** *(High Risk)*
A user inputs property parameters and receives an estimated market value via the AVM model. This is a revenue-adjacent feature used in financing decisions.

---

## 4. What to Automate vs Not Automate

| What | Decision | Reason |
|------|----------|--------|
| Property search flow | ✅ Automate | Core acquisition funnel, high regression risk |
| Authentication | ✅ Automate | Gate for all logged-in features |
| Pre/post login access boundary | ✅ Automate | Critical business rule |
| Tenant credit score visibility | ✅ Automate | Key differentiator between pre/post login |
| Save to Dashboard | ✅ Automate | Core retention feature |
| Multifamily Valuation API | ✅ Automate | Business-critical calculation, fast at API level |
| Neighborhood ratings breakdown | Partial | Presence testable; exact values are dynamic |
| Local amenities data | Partial | API-level validation feasible; UI presence check sufficient |
| Interactive map rendering | ❌ Skip | Third-party Mapbox, visual testing not in scope |
| Servicing/loan flows | ❌ Skip | Requires real loan data tied to actual W&D accounts |
| Cross-browser | ❌ Deferred | Chromium covers primary user base; add as nightly job |
| Pixel-perfect UI | ❌ Skip | No business value relative to maintenance cost |

---

## 5. Testing Approach by Layer

**UI Tests (Playwright)**
Used for user journey validation — search flow, authentication, property detail, dashboard. Assertions validate meaningful business behavior: property name visible, credit score displayed, property status in dashboard.

**API Tests (Playwright request fixture)**
Used for the Multifamily Valuation endpoint (`POST /evra/v5.0/predict`). Testing at the API level is faster, more deterministic, and directly validates the calculation engine without UI overhead.

**API for Test Setup/Teardown**
The `GET /my-properties` and `DELETE /my-properties/{id}` endpoints are used in `beforeEach`/`afterEach` to guarantee a clean dashboard state. This eliminates test interdependency and makes the dashboard test fully deterministic.

**Mocking (page.route)**
Google Places Autocomplete is intercepted in `search-mocked.spec.ts`. This eliminates flakiness from a third-party dependency outside WD Suite's control and makes the search flow deterministic in CI.

---

## 6. Test Data Strategy

Test data is controlled to ensure repeatability and avoid dependence on external state:

- Property search uses known addresses to ensure consistent navigation
- Dashboard tests use API setup/teardown to control saved properties state
- API tests use deterministic payloads for valuation requests
- Dynamic data (e.g., neighborhood ratings, demographics) is validated by structure and presence rather than exact values

This approach ensures tests remain stable despite frequently changing real estate data.

---

## 7. Reliability Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Google Places API instability | Mocked with `page.route()` using real response fixtures |
| Okta token expiration (15 min TTL) | `storageState` refreshed on every CI run via `auth.setup.ts` |
| Dynamic property data | Assertions check presence/visibility, not exact values |
| Dashboard state pollution between runs | API teardown in `beforeEach`/`afterEach` |
| CI environment (headless Linux) | `headless: true` in config, Chromium installed with `--with-deps` |
| Race condition on save | `waitForResponse` on `PUT /my-properties` before navigating to dashboard |
| Third-party data instability | Assert structure and presence, not specific values |

---

## 8. Scope Decisions & Tradeoffs

**Unified repo over separate repos** — UI and API tests live together so API calls can support UI test setup without cross-repository dependencies.

**Chromium only** — The challenge scopes to Chromium as primary browser. Cross-browser coverage would be a natural next step as a nightly job.

**No servicing flows** — WD Suite Servicing requires real loan data tied to actual Walker & Dunlop accounts. This is outside the scope of an external test account and was deliberately excluded.

**Focused tests over broad coverage** — Risk-based prioritization: tests cover the highest-value user journeys and the pre/post login boundary, which is where the most critical business logic lives.

**Google Places mocked separately** — Rather than mocking in every test, a dedicated `search-mocked.spec.ts` demonstrates the technique while keeping the primary search tests running against real Google Places for end-to-end fidelity.

---

## 9. What I Would Do Next

**Expand API test coverage**
Add tests for `GET /evra/v7.14/properties` and `GET /evra/v5.11/my-properties` validating authentication enforcement (403 without Bearer token) and response schema. Environment variables `PROPERTY_API_URL` and `EVRA_API_URL` are already defined in `.env.example` for this purpose.

**Local amenities validation**
The Local Amenities tab exposes APIs for Employers & Institutions, Education, Transit, Retail, Restaurants, Entertainment, and Community Services. API-level tests could validate data availability and structure for each category.

**Neighborhood ratings assertions**
Validate the Safety, Housing, Demographics, and Amenities score breakdown visible in the property detail page including national percentile rankings.

**Dashboard property management flows**
- Remove property from saved — verify it disappears from dashboard
- Connect to a Loan — verify the loan search popup appears correctly

**Map component smoke test**
Lightweight test to verify the Mapbox component renders and map markers are visible, without relying on visual regression testing.

**Cross-browser nightly job**
Extend GitHub Actions with a scheduled workflow running Firefox and WebKit against the pre-login tests as a minimum.