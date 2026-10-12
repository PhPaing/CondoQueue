# CondoQueue

A mobile-first condo resident app for **billing**, **repair requests** and **juristic chat**, with English / Thai language support.

Built with Next.js, TypeScript and Tailwind CSS. All data is mocked in the frontend (no real backend, no real payments).

## Features

- **Dashboard** with amount due, next due date (overdue bills shown in red) and quick summaries
- **Billing** for Common Fee, Water and Electric bills, with a mock PromptPay payment flow
- **Repair requests** with status tracking
- **Chat** with the juristic office (auto-replies)
- **EN / TH** language toggle

## Demo QR code

The QR in the payment window is for demonstration only. It encodes plain text such as:

```
Condo Queue Mock Payment
Bill Type: Water
Amount: 320 THB
Juristic: The Rich Sathorn
```

It is not a real PromptPay payload, so no banking app can use it to transfer money.

## Tech stack

- Next.js 13 (App Router), React 18, TypeScript
- Tailwind CSS, shadcn/ui, lucide-react
- Zustand for state, `qrcode.react` for the demo QR
- Mock service layer in `project/lib/api.ts` that simulates a .NET 8 Web API

## Getting started

The app lives in the `project` folder.

```bash
cd project
npm install
npm run dev
```

Then open **Live demo:** https://condoqueue.netlify.app/

No environment variables are required to run it.

## Project structure

```
project/
  app/          Next.js pages and layout
  components/   Dashboard, billing, repair and chat modules
  lib/          Mock API, seed data, i18n, store and helpers
```
