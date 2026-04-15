# WDSuite QA — Playwright Test Suite

Automated test suite for [WD Suite](https://suite.walkerdunlop.com), a commercial real estate research platform by Walker & Dunlop. Built with Playwright + TypeScript as part of a Senior QA Engineer skills challenge.

The goal of this submission is not full coverage, but to demonstrate:
- Risk-based test strategy and prioritization
- Reliable and maintainable Playwright automation
- Thoughtful engineering decisions and tradeoffs
- Deterministic testing where possible

---

## Tech Stack

- **Playwright** + **TypeScript**
- **Node.js** v24+
- **GitHub Actions** for CI/CD

---

## Project Structure

```
WDSuite_QA/
├── src/
│   ├── api/                    # API client layer
│   │   ├── BaseAPI.ts          # Shared auth token extraction
│   │   ├── ValuationAPI.ts     # AVM valuation endpoint
│   │   └── MyPropertiesAPI.ts  # Dashboard setup/teardown
│   ├── fixtures/               # Mock response fixtures
│   │   └── googlePlacesMocks.ts
│   └── pages/                  # Page Object Model
│       ├── BasePage.ts
│       ├── DashboardPage.ts
│       ├── HomePage.ts
│       ├── LoginPage.ts
│       └── PropertyPage.ts
│  
├── test-data/
│   └── testData.ts             # Test constants and data-driven test cases
├── tests/
│   ├── api/
│   │   └── valuation.spec.ts   # Multifamily Valuation API tests
│   ├── logged-in/
│   │   ├── auth.setup.ts       # Authentication setup
│   │   ├── dashboard.spec.ts   # Dashboard tests
│   │   └── property-detail.spec.ts
│   └── pre-login/
│       ├── search.spec.ts      # Property search tests (data-driven)
│       └── search-mocked.spec.ts # Search with mocked Google Places
├── .env.example
├── playwright.config.ts
└── tsconfig.json
```

---

## Scope and Prioritization

| Area | Why it matters | Approach |
|------|----------------|----------|
| Pre-login property search | Primary entry point for users | UI |
| Search determinism | Third-party dependency (Google Places) | UI + Mocking |
| Property detail navigation | Core user journey | UI |
| Authenticated property data | Business-critical visibility | UI |
| Save property to dashboard | Key user action | UI + API (state control) |
| Valuation (AVM) | Business-critical calculation | API |

### What I Intentionally Did NOT Automate

- Full regression coverage
- Pixel/visual validation
- Deep map interaction testing (Mapbox)
- Servicing/loan flows — require real production-linked data
- Cross-browser execution — deferred to future enhancement

---

## Setup

### Prerequisites

- Node.js v24+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/karinerb19/wdsuite-qa.git
cd wdsuite-qa

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```
BASE_URL=https://suite.walkerdunlop.com
AVM_API_URL=https://avm-rent-api.prod.wdtech.org
EVRA_API_URL=https://evra-backend-api.prod.wdtech.org
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password
```

---

## Running Tests

### Using npm scripts
```bash
npm test                    # Run all tests
npm run test:pre-login      # Pre-login tests only
npm run test:logged-in      # Authenticated tests only
npm run test:api            # API tests only
npm run report              # Open HTML report
```

### Using Playwright directly

```bash
# Run a specific project
npx playwright test --project=pre-login
npx playwright test --project=logged-in
npx playwright test --project=api

# Run a specific spec file
npx playwright test tests/pre-login/search.spec.ts --project=pre-login

# Run in headed mode
npx playwright test --project=pre-login --headed
```

---

## Viewing Reports

After running tests, open the HTML report:

```bash
npx playwright show-report
```

The report includes traces, screenshots, and videos for failed tests.

---

## CI/CD

Tests run automatically on every push and pull request to `main` via GitHub Actions.

The pipeline:
1. Installs dependencies with `npm ci`
2. Installs Chromium browser
3. Runs all test projects
4. Uploads the HTML report as an artifact (retained 30 days)
5. Uploads test results as an artifact (retained 7 days)

Required GitHub Secrets:
- `BASE_URL`
- `AVM_API_URL`
- `EVRA_API_URL`
- `USER_EMAIL`
- `USER_PASSWORD`

---

## Known Limitations & Scope Decisions

- Tests run against production WD Suite — no staging environment available
- Cross-browser coverage limited to Chromium per time constraints
- Servicing/loan flows excluded — require real loan data not available for testing
- Map visual rendering not tested — pixel-level assertions outside scope

---

## Key Decisions & Tradeoffs

### Unified repository with folder-based separation
UI and API tests live in the same repo. This allows API calls to support UI test data setup and keeps the suite cohesive without repository fragmentation.

### storageState for authentication
Login runs once in `auth.setup.ts` and the session is reused across all authenticated tests via Playwright's `storageState`. This avoids repeated login flows and keeps tests fast and stable.

### Mocking Google Places Autocomplete
The property search relies on Google Places API — a third-party dependency outside WD Suite's control. To eliminate flakiness, `search-mocked.spec.ts` intercepts both autocomplete and place details requests with real response fixtures captured from the Network tab. A hybrid approach is used: live tests validate real end-to-end behavior, mocked tests ensure stability in CI.

### API layer separation
`ValuationAPI.ts` and `MyPropertiesAPI.ts` extend a shared `BaseAPI.ts` that handles Bearer token extraction from `storageState`. This separates concerns between test orchestration and HTTP communication, and avoids storing tokens in environment variables.

### API for test setup and teardown
The dashboard test uses `GET /my-properties` and `DELETE /my-properties/{id}` in `beforeEach`/`afterEach` to guarantee a clean state. This eliminates test interdependency and makes the test fully deterministic.

### Data-driven testing
Search test cases are defined in `testData.ts` and iterated in `search.spec.ts`. Adding a new property to test requires only a new entry in the data file, not a new test.

### Assertions in tests, not in page objects
Page objects expose `readonly` locators. Assertions (`expect`) live in spec files. This follows the separation of concerns principle — page objects model behavior, tests verify it.

---

## Mocking Approach

Google Places API is intercepted using `page.route()` in `search-mocked.spec.ts`:

- `**/places.googleapis.com/v1/places:autocomplete**` — returns a controlled suggestion list
- `**/places.googleapis.com/v1/places/**` — returns controlled place details with known coordinates

Fixtures are based on real API responses captured from the Network tab to ensure structural fidelity.

---

## If I Had More Time

- Expand API coverage — properties, amenities, and auth enforcement validation
- Add map component smoke test
- Strengthen neighborhood ratings assertions
- Extend dashboard management flows (remove property, connect to loan)
- Add cross-browser execution as a scheduled nightly CI job

---

## Author

Karine Ramos — Senior QA Automation Engineer
Selenium | Playwright | API Testing | CI/CD
