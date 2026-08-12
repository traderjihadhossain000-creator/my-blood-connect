# Blood Connect — Phase 1

Secure donor and recipient blood-request application built with React, Express, MongoDB and Socket.IO.

## Phase 1 features

- Donor and recipient registration/login
- JWT-protected profile, donor search and blood-request actions
- Division, district, thana, city and optional GPS location
- Blood-group, location, radius, age, weight and 90-day eligibility search
- Direct donor requests and emergency broadcast requests
- One-time donor Accept/Reject response
- Automatic request fulfillment when enough donors accept
- Recipient request tracking and cancellation
- Authenticated real-time notifications
- Privacy-safe public board data

## Setup

1. Copy `backend/.env.example` to `backend/.env` and use your own MongoDB URI and a new random JWT secret.
2. Run `npm install` and `npm start` inside `backend`.
3. Copy `frontend/.env.example` to `frontend/.env` when using a custom API URL.
4. Run `npm install` and `npm run dev` inside `frontend`.

## Verification

- Backend syntax: `npm run check`
- Backend tests: `npm test`
- Frontend lint: `npm run lint`
- Frontend production build: `npm run build`

Never upload `.env`, `node_modules`, database credentials or JWT secrets.
