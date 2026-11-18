# Doctor Tracker API

Express + Mongoose REST API for the Doctor Tracker app. This is the API reference; for the project overview, full setup and the frontend, see the [main README](../README.md).

## Run it

```bash
cp .env.example .env
npm install
npm run seed   # creates the admin from .env if it doesn't exist
npm run dev    # http://localhost:5000
```

Scripts: `dev` (watch mode), `start`, `seed`. Health check: `GET /health`.

## How the code is organised

Every request goes `route -> controller -> service -> repository`.

| Layer | Job |
| --- | --- |
| `routes/` | URLs, auth and validation middleware |
| `controllers/` | Read the request, call a service, send the response |
| `services/` | Business rules, throws `ApiError` |
| `repositories/` | The only place that talks to Mongoose |

Validation uses zod (`validators/`). All errors end up in `middlewares/errorHandler.js`.

## Conventions

Base URL: `/api/v1`. Everything except login needs `Authorization: Bearer <token>`.

Success:

```json
{ "success": true, "data": {}, "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
```

`meta` only appears on lists. Errors:

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "Valid email is required" }] }
```

| Status | When |
| --- | --- |
| 400 | Validation failed, bad id, malformed JSON |
| 401 | Missing, invalid or expired token, wrong login |
| 404 | Doctor, patient or route not found |
| 409 | Duplicate value (doctor email) |
| 500 | Anything unexpected (stack only outside production) |

List endpoints take `page` (default 1) and `limit` (default 10, max 50). `search` is a case-insensitive match on name, phone and email. `from` / `to` are dates filtered on `createdAt` (`to` includes the whole day).

## Endpoints

### Auth

**POST `/auth/login`**, body `{ "email", "password" }`

```json
{ "success": true, "data": { "token": "...", "user": { "id": "...", "name": "Admin", "email": "...", "role": "admin" } } }
```

**GET `/auth/me`** returns the current user.

### Doctors

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/doctors` | Query: `page, limit, search, specialization, hospital, from, to`. Each item includes `patientCount`. |
| GET | `/doctors/filters` | `{ specializations: [], hospitals: [] }` for the filter dropdowns |
| POST | `/doctors` | Body: `name, specialization, hospital, phone, email`. Returns 201. 409 if email exists. |
| GET | `/doctors/:id` | Doctor with `patientCount` |
| GET | `/doctors/:id/patients` | Query: `page, limit, search, condition` |
| POST | `/doctors/:id/patients` | Body: patient fields below. Returns 201. |
| DELETE | `/doctors/:id/patients/:patientId` | Returns `{ id }` |

### Patients

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/patients` | Query: `page, limit, search, condition, doctor, gender, from, to`. `doctor` is a doctor id. |
| GET | `/patients/conditions` | Distinct conditions for the filter dropdown |
| PATCH | `/patients/:id` | Any of the patient fields, plus `doctor` (id) to reassign. At least one field. |
| DELETE | `/patients/:id` | Returns `{ id }` |

Patient fields: `name`, `age` (0-150), `gender` (`male`, `female` or `other`), `phone`, `email` (optional), `condition`. Patients come back with `doctor: { _id, name, specialization }`.

### Dashboard

**GET `/dashboard/stats?days=30`** (`days` is 7, 30 or 90)

```json
{
  "totals": { "doctors": 12, "patients": 48 },
  "patientsPerDoctor": [{ "doctorId": "...", "name": "Dr. Jane Doe", "count": 9 }],
  "patientsOverTime": [{ "date": "2026-11-01", "count": 3 }],
  "doctorsOverTime": [{ "date": "2026-11-01", "count": 1 }],
  "conditionBreakdown": [{ "condition": "Diabetes", "count": 8 }]
}
```

`patientsPerDoctor` is the top 8 doctors. The two time series include every day in the range, with 0 for quiet days.

## Indexes

| Collection | Index | Used for |
| --- | --- | --- |
| doctors | `email` (unique) | Duplicate check |
| doctors | `{ specialization, hospital }` | Filters |
| doctors | `{ createdAt: -1 }` | Default order, date range |
| patients | `{ doctor, createdAt: -1 }` | A doctor's patients, counts |
| patients | `{ condition }` | Filter, breakdown |
| patients | `{ createdAt: -1 }` | Default order, date range, trends |
| patients | `{ phone }` | Phone lookups |
