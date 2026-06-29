# Boom Frontend

React Web proof of concept for the Boom parent dashboard.

## Stack

- React
- TypeScript
- Vite
- Playwright
- Pure SVG chart components for the first dashboard PoC

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Backend integration

By default the frontend calls:

```text
/api/v1/parents/dashboard
```

Vite proxies `/api` to:

```text
http://localhost:8080
```

You can also run with local mock data:

```bash
cp .env.example .env
# set VITE_USE_MOCKS=true
npm run dev
```

## E2E tests

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

The E2E suite intentionally focuses on a few high-value scenarios:

- dashboard renders meaningful learning insights;
- empty state works;
- access denied is handled;
- API failure is handled.
